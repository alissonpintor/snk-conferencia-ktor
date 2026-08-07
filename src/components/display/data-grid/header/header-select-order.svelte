<script>
  import { draggable } from '@neodrag/svelte';
  
  // Estado das colunas
  let columns = $state([
    { id: 1, name: 'Nome', position: 0 },
    { id: 2, name: 'Email', position: 1 },
    { id: 3, name: 'Telefone', position: 2 },
    { id: 4, name: 'Cidade', position: 3 },
    { id: 5, name: 'Status', position: 4 }
  ]);

  let draggedIndex = $state(null);
  let dropTargetIndex = $state(null);

  // Carregar posições salvas do localStorage
  $effect(() => {
    const saved = localStorage.getItem('columnOrder');
    if (saved) {
      const savedOrder = JSON.parse(saved);
      columns = columns.sort((a, b) => {
        const posA = savedOrder.indexOf(a.id);
        const posB = savedOrder.indexOf(b.id);
        return posA - posB;
      });
    }
  });

  function handleDragStart(index) {
    draggedIndex = index;
  }

  function handleDragOver(index) {
    if (draggedIndex === null || draggedIndex === index) return;
    dropTargetIndex = index;
  }

  function handleDragEnd() {
    if (draggedIndex === null || dropTargetIndex === null) {
      draggedIndex = null;
      dropTargetIndex = null;
      return;
    }

    // Reordenar o array
    const newColumns = [...columns];
    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(dropTargetIndex, 0, removed);
    
    columns = newColumns;
    
    // Salvar no localStorage
    saveColumnOrder();
    
    draggedIndex = null;
    dropTargetIndex = null;
  }

  function saveColumnOrder() {
    const order = columns.map(col => col.id);
    localStorage.setItem('columnOrder', JSON.stringify(order));
  }

  function resetOrder() {
    columns = [
      { id: 1, name: 'Nome', position: 0 },
      { id: 2, name: 'Email', position: 1 },
      { id: 3, name: 'Telefone', position: 2 },
      { id: 4, name: 'Cidade', position: 3 },
      { id: 5, name: 'Status', position: 4 }
    ];
    localStorage.removeItem('columnOrder');
  }
</script>

<div class="container">
  <h2>Configurar Colunas</h2>
  <p class="subtitle">Arraste as colunas para reordenar</p>
  
  <ul class="column-list">
    {#each columns as column, index (column.id)}
      <li
        class="column-item"
        class:dragging={draggedIndex === index}
        class:drop-target={dropTargetIndex === index}
        draggable="true"
        ondragstart={() => handleDragStart(index)}
        ondragover={(e) => {
          e.preventDefault();
          handleDragOver(index);
        }}
        ondragend={handleDragEnd}
        ondragleave={() => {
          if (dropTargetIndex === index) dropTargetIndex = null;
        }}
      >
        <span class="drag-handle">⋮⋮</span>
        <span class="column-name">{column.name}</span>
        <span class="column-position">Posição: {index + 1}</span>
      </li>
    {/each}
  </ul>

  <button onclick={resetOrder} class="reset-btn">
    Restaurar Ordem Padrão
  </button>

  <div class="info">
    <strong>Ordem atual:</strong> {columns.map(c => c.name).join(' → ')}
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .subtitle {
    color: #666;
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
  }

  .column-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
  }

  .column-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: move;
    transition: all 0.2s ease;
  }

  .column-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }

  .column-item.dragging {
    opacity: 0.5;
    transform: scale(0.98);
  }

  .column-item.drop-target {
    border-color: #3b82f6;
    border-style: dashed;
    background: #eff6ff;
  }

  .drag-handle {
    color: #999;
    font-size: 1.2rem;
    cursor: grab;
    user-select: none;
  }

  .column-item:active .drag-handle {
    cursor: grabbing;
  }

  .column-name {
    flex: 1;
    font-weight: 500;
    color: #333;
  }

  .column-position {
    font-size: 0.85rem;
    color: #666;
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }

  .reset-btn {
    padding: 0.75rem 1.5rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .reset-btn:hover {
    background: #dc2626;
  }

  .info {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #555;
    word-wrap: break-word;
  }
</style>