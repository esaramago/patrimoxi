<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import { page } from '$app/state'

  let user = $derived(page.data.user)
</script>

<header class="l-container">
  <Grid align="center" justify="space-between">
    <a href="/" style="text-decoration: none; color: inherit;">
      <Grid align="center" gap="s">
        <wa-icon name="wallet" variant="solid"></wa-icon>
        <strong>Patrimoxi</strong>
      </Grid>
    </a>

    {#if user}
      <Grid align="center" gap="s">
        <span>{user.name || user.email}</span>
        <form method="POST" action="/logout">
          <wa-button type="submit" size="small" variant="neutral">
            <wa-icon slot="start" name="arrow-right-from-bracket"></wa-icon>
            Sign Out
          </wa-button>
        </form>
      </Grid>
    {:else}
      <Grid align="center" gap="s">
        <wa-button href="/login" size="small" variant="neutral">
          <wa-icon slot="start" name="arrow-right-to-bracket"></wa-icon>
          Sign In
        </wa-button>
      </Grid>
    {/if}
  </Grid>
</header>

<style>
  header {
    padding: var(--wa-space-l) 0;
  }
</style>