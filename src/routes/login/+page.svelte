<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { ActionData } from './$types'

  let { form }: { form: ActionData } = $props()
</script>

<Grid direction="column" align="center" gap="xl">
  <wa-card>
    <Grid direction="column" gap="l">
      <Grid direction="column" gap="xs" align="center">
        <wa-icon name="wallet" variant="solid"></wa-icon>
        <h2>Patrimoxi Login</h2>
        <p>Sign in to your wealth tracking dashboard</p>
      </Grid>

      {#if form?.message}
        <wa-callout variant="danger">
          <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
          {form.message}
        </wa-callout>
      {/if}

      <form method="POST" action="?/login">
        <Grid direction="column" gap="l">
          <wa-input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form?.email ?? ''}
            required
            autocomplete="email"
          ></wa-input>

          <wa-input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            password-toggle
            autocomplete="current-password"
          ></wa-input>

          <wa-button type="submit" variant="brand">
            <wa-icon slot="start" name="arrow-right-to-bracket"></wa-icon>
            Sign In
          </wa-button>
        </Grid>
      </form>
    </Grid>
  </wa-card>
</Grid>
