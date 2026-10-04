<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { Account } from '@/types/account'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let accounts = $derived<Account[]>(data.accounts ?? [])
  let activeCount = $derived(accounts.filter((a) => a.active).length)
  let inactiveCount = $derived(accounts.filter((a) => !a.active).length)

  function handleSelect(accountId: string, event: Event) {
    const customEvent = event as CustomEvent<{ item?: { value?: string } }>
    const value = customEvent.detail?.item?.value

    if (value === 'toggle') {
      const form = document.getElementById(`toggle-form-${accountId}`) as HTMLFormElement | null
      form?.requestSubmit()
    } else if (value === 'delete') {
      const form = document.getElementById(`delete-form-${accountId}`) as HTMLFormElement | null
      form?.requestSubmit()
    }
  }
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="s">
    <Grid align="center" justify="space-between" wrap={true}>
      <Grid direction="column" gap="xs">
        <h1>Accounts</h1>
        <p>Register and manage your bank accounts, brokers, and crypto wallets.</p>
      </Grid>

      <wa-button variant="brand" href="/accounts/new">
        <wa-icon slot="start" name="plus"></wa-icon>
        New Account
      </wa-button>
    </Grid>

    <Grid align="center" gap="s">
      <wa-badge variant="brand">{accounts.length} Total</wa-badge>
      <wa-badge variant="success">{activeCount} Active</wa-badge>
      {#if inactiveCount > 0}
        <wa-badge variant="neutral">{inactiveCount} Inactive</wa-badge>
      {/if}
    </Grid>
  </Grid>

  {#if form?.message}
    <wa-callout variant="danger">
      <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
      {form.message}
    </wa-callout>
  {/if}

  {#if data.error}
    <wa-callout variant="danger">
      <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
      {data.error}
    </wa-callout>
  {/if}

  {#if accounts.length === 0}
    <wa-card>
      <Grid direction="column" align="center" gap="m">
        <wa-icon name="wallet" variant="solid"></wa-icon>
        <h3>No accounts registered yet</h3>
        <p>Start tracking your assets by registering your first account.</p>
        <wa-button variant="brand" href="/accounts/new">
          <wa-icon slot="start" name="plus"></wa-icon>
          Create First Account
        </wa-button>
      </Grid>
    </wa-card>
  {:else}
    <table class="c-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Currency</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each accounts as account (account.id)}
          <tr>
            <td>
              <a href="/accounts/{account.id}">
                <strong>{account.name}</strong>
              </a>
            </td>
            <td>
              <wa-badge variant="neutral">{account.currency}</wa-badge>
            </td>
            <td>
              {#if account.active}
                <wa-badge variant="success">Active</wa-badge>
              {:else}
                <wa-badge variant="neutral">Inactive</wa-badge>
              {/if}
            </td>
            <td>
              <wa-dropdown placement="bottom-end" onwa-select={(e: Event) => handleSelect(account.id, e)}>
                <wa-button slot="trigger" size="small" variant="neutral" aria-label="Actions">
                  <wa-icon name="ellipsis-vertical"></wa-icon>
                </wa-button>
                <wa-dropdown-item value="view" href="/accounts/{account.id}">
                  <wa-icon slot="icon" name="eye"></wa-icon>
                  View
                </wa-dropdown-item>
                <wa-dropdown-item value="edit" href="/accounts/{account.id}/edit">
                  <wa-icon slot="icon" name="pen-to-square"></wa-icon>
                  Edit
                </wa-dropdown-item>
                <wa-dropdown-item value="toggle">
                  {#if account.active}
                    <wa-icon slot="icon" name="pause"></wa-icon>
                    Deactivate
                  {:else}
                    <wa-icon slot="icon" name="play"></wa-icon>
                    Activate
                  {/if}
                </wa-dropdown-item>
                <wa-divider></wa-divider>
                <wa-dropdown-item value="delete" variant="danger">
                  <wa-icon slot="icon" name="trash"></wa-icon>
                  Delete
                </wa-dropdown-item>
              </wa-dropdown>

              <form id="toggle-form-{account.id}" method="POST" action="?/toggleActive">
                <input type="hidden" name="id" value={account.id} />
              </form>

              <form
                id="delete-form-{account.id}"
                method="POST"
                action="?/delete"
                onsubmit={(e) => {
                  if (!confirm('Are you sure you want to delete this account?')) {
                    e.preventDefault()
                  }
                }}
              >
                <input type="hidden" name="id" value={account.id} />
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</Grid>
