<script lang="ts">
  import styles from "./form.module.scss";

  let methodology = "formula";
  let disinfectant = "chloramine";
  let pathogen = "giardia";
  let temperature = "";
  let concentration = "";
  let ph = "";
  let logInactivation = "";

  let inactivation = "";

  async function onSubmit(event: Event) {
    event.preventDefault();

    const response = await fetch(
      `/api/calc` +
        `?methodology=${methodology}` +
        `&disinfectant=${disinfectant}` +
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
    inactivation = json.inactivation;
  }
</script>

<form class={styles.form} on:submit={onSubmit}>
  <label for="methodology">Methodology:</label>
  <select name="methodology" id="methodology" bind:value={methodology}>
    <option value="formula">Formula</option>
    <option value="interpolate">Linear Interpolation</option>
  </select>

  <label for="disinfectant">Disinfectant:</label>
  <select name="disinfectant" id="disinfectant" bind:value={disinfectant}>
    <option value="chloramine">Chloramine</option>
    <option value="chlorine_dioxide">Chlorine Dioxide</option>
    <option value="free_chlorine">Free Chlorine</option>
    <option value="ozone">Ozone</option>
  </select>

  <label for="pathogen">Pathogen:</label>
  <select
    name="pathogen"
    id="pathogen"
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
    bind:value={temperature}
  />

  {#if disinfectant === "free_chlorine"}
    <label for="concentration">Concentration:</label>
    <input
      type="number"
      id="concentration"
      name="concentration"
      bind:value={concentration}
    />

    <label for="ph">pH:</label>
    <input type="number" id="ph" name="ph" bind:value={ph} />
  {/if}

  <label for="log-inactivation">Logs of Inactivation:</label>
  <select
    name="log-inactivation"
    id="log-inactivation"
    bind:value={logInactivation}
  >
    {#if pathogen === "giardia"}
      <option value="1.0">2.0</option>
      <option value="2.0">3.0</option>
      <option value="3.0">4.0</option>
    {:else}
      <option value="0.5">0.5</option>
      <option value="1.0">1.0</option>
      <option value="1.5">1.5</option>
      <option value="2.0">2.0</option>
      <option value="2.5">2.5</option>
      <option value="3.0">3.0</option>
    {/if}
  </select>

  <br />
  <button type="submit">Submit</button>

  {#if inactivation}
    <p class={styles.result}>Result:</p>
    <p>{inactivation}</p>
  {/if}
</form>
