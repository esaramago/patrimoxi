<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import { page } from '$app/state'

  let user = $derived(page.data.user)
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column">
    <Grid align="center" gap="s">
      <wa-badge variant="brand">Patrimoxi</wa-badge>
      <wa-badge variant="neutral">v0.0.1</wa-badge>
      {#if user}
        <wa-badge variant="success">Authenticated</wa-badge>
      {/if}
    </Grid>

    <h1>Patrimoxi — Personal Wealth Tracking</h1>
    <p>
      Self-hosted wealth tracking system designed to monitor bank accounts, investments,
      holdings, and record daily net worth snapshots.
    </p>

    <Grid wrap={true}>
      {#if user}
        <wa-button variant="brand" href="/dashboard">
          <wa-icon slot="start" name="chart-pie" variant="solid"></wa-icon>
          View Dashboard
        </wa-button>
      {:else}
        <wa-button variant="brand" href="/login">
          <wa-icon slot="start" name="arrow-right-to-bracket"></wa-icon>
          Sign In
        </wa-button>
      {/if}
      <wa-button variant="neutral" href="http://localhost:8090/_/" target="_blank">
        <wa-icon slot="start" name="database" variant="solid"></wa-icon>
        PocketBase Admin
      </wa-button>
    </Grid>
  </Grid>

  <Grid direction="column">
    <h2>System Architecture</h2>

    <Grid wrap={true} break="small">
      <wa-card>
        <Grid direction="column" gap="s">
          <Grid align="center" gap="s">
            <wa-icon name="wallet" variant="solid"></wa-icon>
            <strong>Accounts & Holdings</strong>
          </Grid>
          <p>
            Track bank accounts, brokers, crypto, and holdings with average cost and last known price.
          </p>
        </Grid>
      </wa-card>

      <wa-card>
        <Grid direction="column" gap="s">
          <Grid align="center" gap="s">
            <wa-icon name="clock-rotate-left" variant="solid"></wa-icon>
            <strong>Daily Snapshot Engine</strong>
          </Grid>
          <p>
            Automated daily routine aggregating positions and recording historical total net worth.
          </p>
        </Grid>
      </wa-card>

      <wa-card>
        <Grid direction="column" gap="s">
          <Grid align="center" gap="s">
            <wa-icon name="database" variant="solid"></wa-icon>
            <strong>PocketBase Backend</strong>
          </Grid>
          <p>
            Single-file SQLite backend managing auth, collections, relations, and REST API.
          </p>
        </Grid>
      </wa-card>

      <wa-card>
        <Grid direction="column" gap="s">
          <Grid align="center" gap="s">
            <wa-icon name="bolt" variant="solid"></wa-icon>
            <strong>SvelteKit & WebAwesome</strong>
          </Grid>
          <p>
            Lightweight, reactive frontend built with SvelteKit and accessible WebAwesome components.
          </p>
        </Grid>
      </wa-card>

      <wa-card>
        <Grid direction="column" gap="s">
          <Grid align="center" gap="s">
            <wa-icon name="arrow-right-arrow-left"></wa-icon>
            <strong>Exchange Rates & Caching</strong>
          </Grid>
          <p>
            ECB currency conversion with multi-tiered local caching to minimize external API calls.
          </p>
        </Grid>
      </wa-card>

      <wa-card>
        <Grid direction="column" gap="s">
          <Grid align="center" gap="s">
            <wa-icon name="docker" family="brands"></wa-icon>
            <strong>Docker & Coolify</strong>
          </Grid>
          <p>
            Pre-configured container orchestration ready for self-hosting on your VPS via Coolify.
          </p>
        </Grid>
      </wa-card>
    </Grid>
  </Grid>
</Grid>
