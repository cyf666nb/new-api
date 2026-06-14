<script setup lang="ts">
import type { Skill } from '../../contracts'
import { providerMap } from '../../data/providers'
import ProviderIcon from '../ui/ProviderIcon.vue'

defineProps<{
  skill: Skill
}>()
</script>

<template>
  <RouterLink class="skill-card" :to="`/skills/${skill.slug}`">
    <div class="skill-card__head">
      <ProviderIcon :provider-id="skill.providerId" :size="24" />
      <div>
        <div class="skill-card__name">{{ skill.name }}</div>
        <div class="skill-card__provider">{{ providerMap[skill.providerId].displayName }}</div>
      </div>
      <span class="skill-card__trust">{{ skill.trustLevel }}</span>
    </div>
    <p>{{ skill.summary }}</p>
    <div class="skill-card__tags">
      <span v-for="tag in skill.tags" :key="tag">{{ tag }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.skill-card {
  display: flex;
  flex-direction: column;
  min-height: 180px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.018);
  padding: 22px;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.skill-card:hover {
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.skill-card__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skill-card__name {
  font-weight: 700;
}

.skill-card__provider {
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
}

.skill-card__trust {
  margin-left: auto;
  border-radius: 999px;
  background: rgba(77, 184, 153, 0.08);
  color: #4db899;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 700;
}

p {
  margin: 18px 0;
  color: rgba(0, 0, 0, 0.52);
  font-size: 13px;
  line-height: 1.7;
}

.skill-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.skill-card__tags span {
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 8px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 10px;
  font-weight: 600;
}
</style>
