<script lang="ts">
  import styles from "./form.module.scss";

  let disinfectant = "chloramine";
  let pathogen = "giardia";
  let temperature = "";
  let concentration = "";
  let ph = "";
  let logInactivation = "0.5";

  let formulaResult = "";
  let interpolatedResult = "";
  let error = "";

  async function onSubmit(event: Event) {
    event.preventDefault();

    const response = await fetch(
      `/api/calc` +
        `?disinfectant=${disinfectant}` +
        `&pathogen=${pathogen}` +
        `&temperature=${temperature}` +
        `&concentration=${concentration}` +
        `&ph=${ph}` +
        `&inactivation_log=${logInactivation}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const json = await response.json();
    formulaResult = json.formulaResult;
    interpolatedResult = json.interpolatedResult;
    error = json.error;
  }
</script>

<form class={styles.form} on:submit={onSubmit}>
  <label for="disinfectant">Disinfectant:</label>
  <select
    name="disinfectant"
    id="disinfectant"
    required
    bind:value={disinfectant}
  >
    <option value="chloramine">Chloramine</option>
    <option value="chlorine_dioxide">Chlorine Dioxide</option>
    <option value="free_chlorine">Free Chlorine</option>
    <option value="ozone">Ozone</option>
  </select>

  <label for="pathogen">Pathogen:</label>
  <select
    name="pathogen"
    id="pathogen"
    required
    bind:value={pathogen}
    on:change={() => (logInactivation = "")}
  >
    <option value="giardia">Giardia</option>
    <option value="virus">Virus</option>
  </select>

  <label for="temperature">Temperature (°C):</label>
  <input
    type="number"
    id="temperature"
    name="temperature"
    required
    bind:value={temperature}
  />

  {#if disinfectant === "free_chlorine"}
    <label for="concentration">Concentration:</label>
    <input
      type="number"
      id="concentration"
      name="concentration"
      required
      bind:value={concentration}
    />

    <label for="ph">pH:</label>
    <input type="number" id="ph" name="ph" required bind:value={ph} />
  {/if}

  <label for="log-inactivation">Logs of Inactivation:</label>
  <select
    name="log-inactivation"
    id="log-inactivation"
    required
    bind:value={logInactivation}
  >
    {#if pathogen === "giardia"}
      <option value="0.5">0.5</option>
      <option value="1.0">1.0</option>
      <option value="1.5">1.5</option>
      <option value="2.0">2.0</option>
      <option value="2.5">2.5</option>
      <option value="3.0">3.0</option>
    {:else}
      <option value="1.0">2.0</option>
      <option value="2.0">3.0</option>
      <option value="3.0">4.0</option>
    {/if}
  </select>

  <br />
  <button type="submit">Submit</button>

  {#if formulaResult && interpolatedResult}
    <div class={styles.divider} />

    <p class={styles.result}>Formula result:</p>
    <p data-cy="result">{formulaResult}</p>

    <p class={styles.result}>Interpolated result:</p>
    <p data-cy="result">{interpolatedResult}</p>
  {:else if error}
    <div class={styles.divider} />
    <p class={styles.result}>Error:</p>
    <p data-cy="result">{error}</p>
  {/if}
</form>
