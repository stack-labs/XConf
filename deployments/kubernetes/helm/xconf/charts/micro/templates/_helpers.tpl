{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "micro.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "micro.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "micro.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "micro.labels" -}}
helm.sh/chart: {{ include "micro.chart" . }}
{{ include "micro.selectorLabels" . }}
{{- if .Values.global.appVersion }}
app.kubernetes.io/version: {{ .Values.global.appVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}

{{- define "micro.selectorLabels" -}}
app.kubernetes.io/name: {{ include "micro.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "micro.serviceAccountName" -}}
{{- if .Values.global.serviceAccount.create -}}
    {{ default (include "micro.fullname" .) .Values.global.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.global.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Environments
*/}}
{{- define "micro.env" -}}
- name: MICRO_API_ADDRESS
  value: 0.0.0.0:{{ .Values.service.port -}}
{{- range .Values.global.env }}
- name: {{ .name }}
  {{- if .valueFrom -}}
  {{- if .valueFrom.secretKeyRef }}
  valueFrom:
    secretKeyRef:
      name: {{ .valueFrom.secretKeyRef.name }}
      key: {{ .valueFrom.secretKeyRef.key }}
      optional: {{ default true .valueFrom.secretKeyRef.optional -}}
  {{- end -}}
  {{- else }}
  value: {{ .value -}}
  {{- end -}}
{{- end -}}
{{- range .Values.env }}
- name: {{ .name }}
  {{- if .valueFrom -}}
  {{- if .valueFrom.secretKeyRef }}
  valueFrom:
    secretKeyRef:
      name: {{ .valueFrom.secretKeyRef.name }}
      key: {{ .valueFrom.secretKeyRef.key }}
      optional: {{ default true .valueFrom.secretKeyRef.optional -}}
  {{- end -}}
  {{- else }}
  value: {{ .value -}}
  {{- end -}}
{{- end -}}
{{- end -}}
