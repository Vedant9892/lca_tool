const apiBase = "http://localhost:8000";

const $ = (sel)=>document.querySelector(sel);
const $$ = (sel)=>document.querySelectorAll(sel);

function toggleDims(){
  const product = $("#product").value;
  $("#pipe-dims").classList.toggle("hidden", product!=="pipe");
  $("#sheet-dims").classList.toggle("hidden", product!=="sheet");
  // Grade only when conventional
  const route = $("#route").value;
  $("#grade-wrap").style.display = (route==="conventional") ? "block" : "none";
}

$("#product").addEventListener("change", toggleDims);
$("#route").addEventListener("change", toggleDims);
toggleDims();

function card(name, value, unit=""){
  // Ensure value is a number before calling toLocaleString
  const safeValue = (value === undefined || value === null) ? 0 : Number(value);
  return `
  <div class="summary-card">
    <h4>${name}</h4>
    <div class="value">${safeValue.toLocaleString(undefined, {maximumFractionDigits:2})} ${unit}</div>
  </div>`;
}

async function handleSubmit(e){
  e.preventDefault();
  $("#status").textContent = "Computing...";
  $("#submit-btn").disabled = true;

  // Build payload
  const payload = {
    product: $("#product").value,
    units: parseInt($("#units").value, 10),
    route_type: $("#route").value,
    bauxite_grade: $("#grade").value,
    energy_source: $("#energy").value,
    eol_option: $("#eol").value,
    outer_radius_m: parseFloat($("#outer_radius_m").value || 0),
    inner_radius_m: parseFloat($("#inner_radius_m").value || 0),
    length_m: parseFloat($("#length_m").value || 0),
    thickness_m: parseFloat($("#thickness_m").value || 0),
    width_m: parseFloat($("#width_m").value || 0),
    sheet_length_m: parseFloat($("#sheet_length_m").value || 0),
  };
  if(payload.route_type !== "conventional"){ payload.bauxite_grade = "na"; }

  try{
    const res = await fetch(`${apiBase}/dashboard/stages`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      const txt = await res.text();
      throw new Error(`API ${res.status}: ${txt}`);
    }
    const data = await res.json();
    renderResults(data);
    $("#status").textContent = "Done.";
    $("#results").classList.remove("hidden");
  }catch(err){
    console.error(err);
    $("#status").textContent = `Error: ${err.message}`;
  }finally{
    $("#submit-btn").disabled = false;
  }
}

function renderResults(data){
  // Ensure data structure exists
  if (!data || !data.totals || !data.stages) {
    $("#status").textContent = "Error: Invalid data structure received from API";
    return;
  }

  const totals = data.totals || {};
  const stages = data.stages || [];
  
  // Ensure per_unit and total exist
  const per = totals.per_unit || {};
  const tot = totals.total || {};

  $("#summary").innerHTML = `
    ${card("Per-unit Electricity", per?.electricity_kwh || 0, "kWh")}
    ${card("Per-unit CO₂", per?.carbon_kgco2e || 0, "kg")}
    ${card("Per-unit Cost", per?.manufacturing_cost_per_unit || 0, "USD")}
    ${card("Total Electricity", tot?.electricity_kwh || 0, "kWh")}
    ${card("Total CO₂", tot?.carbon_kgco2e || 0, "kg")}
    ${card("Total Cost", tot?.manufacturing_cost_per_unit || 0, "USD")}
    ${card("Total Transport", tot?.transport_cost_usd || 0, "USD")}
    ${card("Total Wastewater", tot?.wastewater_l || 0, "L")}
    ${card("Avg Quality", per?.Quality_Score || 0, "")}
  `;

  // Stage table
  const tbody = $("#stage-table tbody");
  tbody.innerHTML = "";
  stages.forEach(r=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r?.stage || ''}</td>
      <td>${r?.scope || ''}</td>
      <td>${r?.units || ''}</td>
      <td>${((r?.quality_score !== undefined && r?.quality_score !== null) ? Number(r.quality_score) : 0).toFixed(2)}</td>
      <td>${((r?.electricity_kwh !== undefined && r?.electricity_kwh !== null) ? Number(r.electricity_kwh) : 0).toFixed(2)}</td>
      <td>${((r?.carbon_kgco2e !== undefined && r?.carbon_kgco2e !== null) ? Number(r.carbon_kgco2e) : 0).toFixed(2)}</td>
      <td>${((r?.naturalGas_nm3 !== undefined && r?.naturalGas_nm3 !== null) ? Number(r.naturalGas_nm3) : 0).toFixed(3)}</td>
      <td>${((r?.wastewater_l !== undefined && r?.wastewater_l !== null) ? Number(r.wastewater_l) : 0).toFixed(2)}</td>
      <td>${((r?.manufacturing_cost_per_unit_usd !== undefined && r?.manufacturing_cost_per_unit_usd !== null) ? Number(r.manufacturing_cost_per_unit_usd) : 0).toFixed(2)}</td>
      <td>${((r?.transport_cost_usd !== undefined && r?.transport_cost_usd !== null) ? Number(r.transport_cost_usd) : 0).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("lca-form").addEventListener("submit", handleSubmit);
