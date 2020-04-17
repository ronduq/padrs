---
title: Job
layout: default
pagination:
    data: jobs
    size: 1
    alias: job
permalink: "jobs/{{ job.jobFields.jobTitle | slug }}-{{ job.id }}/"
---

<h1>{{ job.jobFields.jobTitle }}</h1>

<a href="{{ job.jobFields.applicationUrl }}">Apply now</a>

{% for f in job.customFields %}
  <h2>{{ f.title }}</h2>
  {{ f.content | safe }}
{% endfor %}
