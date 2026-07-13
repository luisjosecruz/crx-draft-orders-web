<template>
	<p class="mt-6 items-center text-xs text-white w-100">v{{ version }}-{{ commitHash }}</p>
 </template>
 
 <script lang="ts" setup inheritAttrs="false">
 const version = import.meta.env.VITE_APP_VERSION || '0.0.0'
 const commitHash = import.meta.env.VITE_APP_COMMIT_HASH || 'N/A'
 </script>