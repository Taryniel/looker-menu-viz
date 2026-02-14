// Menu de Navegação Avançado para Looker Studio
// Integração com DSCC para navegação fluida entre páginas

// Biblioteca de ícones Material Icons
const ICON_MAP = {
  'home': '🏠',
  'dashboard': '📊',
  'analytics': '📈',
  'report': '📋',
  'description': '📄',
  'shopping_cart': '🛒',
  'campaign': '📢',
  'people': '👥',
  'settings': '⚙️',
  'insights': '💡',
  'trending_up': '📈',
  'bar_chart': '📊',
  'pie_chart': '🥧',
  'table_chart': '📋',
  'assessment': '📊',
  'account_balance': '🏦',
  'attach_money': '💰',
  'credit_card': '💳',
  'store': '🏪',
  'inventory': '📦',
  'local_shipping': '🚚',
  'map': '🗺️',
  'calendar_today': '📅',
  'schedule': '⏰',
  'notifications': '🔔',
  'email': '✉️',
  'phone': '📞',
  'print': '🖨️',
  'cloud': '☁️',
  'folder': '📁',
  'star': '⭐',
  'favorite': '❤️',
  'bookmark': '🔖',
  'search': '🔍',
  'filter': '🔽',
  'sort': '🔀',
  'arrow_forward': '→',
  'arrow_back': '←',
  'expand_more': '▼',
  'expand_less': '▲'
};

// Estado global da aplicação
let currentState = {
  activePage: null,
  expandedMenus: new Set(),
  config: {},
  menuItems: []
};

// Função principal de inicialização
function drawViz(data) {
  try {
    // Atualizar configuração
    currentState.config = parseConfig(data);
    currentState.menuItems = parseMenuItems(currentState.config.menuItems);
    
    // Renderizar menu
    renderMenu();
    
    // Inicializar página ativa (se houver)
    initializeActivePage();
    
  } catch (error) {
    console.error('Erro ao desenhar visualização:', error);
    showError('Erro ao carregar o menu. Verifique a configuração.');
  }
}

// Parse da configuração recebida do Looker Studio
function parseConfig(data) {
  const style = data.style || {};
  
  return {
    orientation: style.menuOrientation || 'horizontal',
    position: style.menuPosition || 'top',
    menuStyle: style.menuStyle || 'modern',
    menuBgColor: style.menuBgColor?.color || '#ffffff',
    itemColor: style.menuItemColor?.color || '#333333',
    itemHoverColor: style.menuItemHoverColor?.color || '#0066cc',
    itemActiveColor: style.menuItemActiveColor?.color || '#0066cc',
    itemActiveBg: style.menuItemActiveBg?.color || '#e6f2ff',
    showIcons: style.showIcons !== false,
    iconSize: style.iconSize || '20px',
    fontSize: style.fontSize || '14px',
    fontFamily: style.fontFamily?.font || 'Roboto',
    menuPadding: style.menuPadding || '12',
    itemSpacing: style.itemSpacing || '8',
    borderRadius: style.borderRadius || '8',
    showShadow: style.showShadow !== false,
    animationDuration: style.animationDuration || '300',
    submenuBgColor: style.submenuBgColor?.color || '#f8f9fa',
    submenuIndent: style.submenuIndent || '20',
    showDividers: style.showDividers || false,
    dividerColor: style.dividerColor?.color || '#e0e0e0',
    menuItems: style.menuItems || '[]'
  };
}

// Parse dos itens do menu do JSON
function parseMenuItems(jsonString) {
  try {
    const items = JSON.parse(jsonString);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Erro ao fazer parse dos itens do menu:', error);
    return getDefaultMenuItems();
  }
}

// Itens de menu padrão
function getDefaultMenuItems() {
  return [
    {
      id: 'page1',
      label: 'Dashboard Principal',
      icon: 'home',
      page: 'page1',
      color: '#0066cc'
    },
    {
      id: 'page2',
      label: 'Análises',
      icon: 'analytics',
      page: 'page2',
      color: '#ff6b6b',
      submenu: [
        {
          id: 'page2-1',
          label: 'Vendas',
          icon: 'shopping_cart',
          page: 'page2-1'
        },
        {
          id: 'page2-2',
          label: 'Marketing',
          icon: 'campaign',
          page: 'page2-2'
        }
      ]
    },
    {
      id: 'page3',
      label: 'Relatórios',
      icon: 'description',
      page: 'page3',
      color: '#4ecdc4'
    }
  ];
}

// Renderizar o menu completo
function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container) {
    console.error('Container do menu não encontrado');
    return;
  }
  
  // Limpar container
  container.innerHTML = '';
  
  // Aplicar estilos CSS customizados
  applyCSSVariables();
  
  // Criar elemento do menu
  const menuElement = createMenuElement();
  
  // Adicionar itens do menu
  currentState.menuItems.forEach((item, index) => {
    const menuItem = createMenuItem(item, 0);
    menuElement.appendChild(menuItem);
    
    // Adicionar divisor se configurado
    if (currentState.config.showDividers && index < currentState.menuItems.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'menu-divider';
      menuElement.appendChild(divider);
    }
  });
  
  container.appendChild(menuElement);
}

// Criar elemento principal do menu
function createMenuElement() {
  const menu = document.createElement('div');
  const orientation = currentState.config.orientation === 'vertical' ? 'vertical' : 'horizontal';
  const style = currentState.config.menuStyle || 'modern';
  
  menu.className = `menu-${orientation} menu-style-${style}`;
  menu.id = 'main-menu';
  
  return menu;
}

// Criar item do menu individual
function createMenuItem(item, level = 0) {
  const itemElement = document.createElement('div');
  itemElement.className = 'menu-item';
  itemElement.setAttribute('data-item-id', item.id);
  itemElement.setAttribute('data-page', item.page || '');
  itemElement.setAttribute('tabindex', '0');
  
  // Aplicar cor customizada se definida
  if (item.color) {
    itemElement.setAttribute('data-custom-color', 'true');
    itemElement.style.setProperty('--custom-color', item.color);
  }
  
  // Ícone
  if (currentState.config.showIcons && item.icon) {
    const icon = document.createElement('span');
    icon.className = 'menu-icon';
    icon.textContent = ICON_MAP[item.icon] || '📄';
    itemElement.appendChild(icon);
  }
  
  // Label
  const label = document.createElement('span');
  label.className = 'menu-label';
  label.textContent = item.label;
  itemElement.appendChild(label);
  
  // Badge (se houver)
  if (item.badge) {
    const badge = document.createElement('span');
    badge.className = 'menu-badge';
    badge.textContent = item.badge;
    itemElement.appendChild(badge);
  }
  
  // Indicador de submenu
  if (item.submenu && item.submenu.length > 0) {
    const indicator = document.createElement('span');
    indicator.className = 'submenu-indicator';
    indicator.textContent = '▼';
    itemElement.appendChild(indicator);
    
    // Container do submenu
    const submenu = createSubmenu(item.submenu);
    const wrapper = document.createElement('div');
    wrapper.appendChild(itemElement);
    wrapper.appendChild(submenu);
    
    // Event listener para expandir/colapsar
    itemElement.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSubmenu(item.id, submenu, itemElement);
    });
    
    return wrapper;
  }
  
  // Event listener para navegação
  itemElement.addEventListener('click', (e) => {
    e.preventDefault();
    if (item.page) {
      navigateToPage(item.page, item.id);
    }
  });
  
  // Suporte a teclado
  itemElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      itemElement.click();
    }
  });
  
  return itemElement;
}

// Criar submenu
function createSubmenu(items) {
  const submenu = document.createElement('div');
  submenu.className = 'submenu';
  
  items.forEach(subItem => {
    const subMenuItem = createMenuItem(subItem, 1);
    submenu.appendChild(subMenuItem);
  });
  
  return submenu;
}

// Toggle submenu (expandir/colapsar)
function toggleSubmenu(itemId, submenuElement, parentElement) {
  const isExpanded = currentState.expandedMenus.has(itemId);
  
  if (isExpanded) {
    currentState.expandedMenus.delete(itemId);
    submenuElement.classList.remove('expanded');
    parentElement.classList.remove('expanded');
  } else {
    currentState.expandedMenus.add(itemId);
    submenuElement.classList.add('expanded');
    parentElement.classList.add('expanded');
  }
}

// Navegação entre páginas do Looker Studio
function navigateToPage(pageId, itemId) {
  // Remover classe active de todos os itens
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Adicionar classe active ao item clicado
  const clickedItem = document.querySelector(`[data-item-id="${itemId}"]`);
  if (clickedItem) {
    clickedItem.classList.add('active');
  }
  
  // Atualizar estado
  currentState.activePage = pageId;
  
  // Navegar usando a API do Looker Studio
  // A navegação é feita através de filter interactions
  // que alteram o estado do relatório sem recarregar a página
  
  try {
    // Usando postMessage para comunicar com o Looker Studio
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'looker-studio-navigation',
        action: 'navigate',
        page: pageId,
        timestamp: Date.now()
      }, '*');
    }
    
    // Para desenvolvimento/teste
    console.log(`Navegando para a página: ${pageId}`);
    
    // Emitir evento customizado que pode ser capturado pelo Looker Studio
    const event = new CustomEvent('menuNavigation', {
      detail: { page: pageId, itemId: itemId }
    });
    window.dispatchEvent(event);
    
    // Salvar no sessionStorage para persistência
    sessionStorage.setItem('looker-menu-active-page', pageId);
    
    // Aplicar animação de transição
    animatePageTransition();
    
  } catch (error) {
    console.error('Erro ao navegar:', error);
  }
}

// Animação de transição de página
function animatePageTransition() {
  const container = document.getElementById('menu-container');
  if (container) {
    container.style.opacity = '0.7';
    setTimeout(() => {
      container.style.opacity = '1';
    }, parseInt(currentState.config.animationDuration) || 300);
  }
}

// Inicializar página ativa
function initializeActivePage() {
  // Tentar recuperar página ativa do sessionStorage
  const savedPage = sessionStorage.getItem('looker-menu-active-page');
  
  if (savedPage) {
    const item = findMenuItemByPage(savedPage, currentState.menuItems);
    if (item) {
      const element = document.querySelector(`[data-item-id="${item.id}"]`);
      if (element) {
        element.classList.add('active');
        currentState.activePage = savedPage;
      }
    }
  } else if (currentState.menuItems.length > 0) {
    // Ativar primeiro item por padrão
    const firstItem = currentState.menuItems[0];
    const element = document.querySelector(`[data-item-id="${firstItem.id}"]`);
    if (element) {
      element.classList.add('active');
      currentState.activePage = firstItem.page;
    }
  }
}

// Encontrar item do menu por página
function findMenuItemByPage(pageId, items) {
  for (const item of items) {
    if (item.page === pageId) {
      return item;
    }
    if (item.submenu) {
      const found = findMenuItemByPage(pageId, item.submenu);
      if (found) return found;
    }
  }
  return null;
}

// Aplicar variáveis CSS customizadas
function applyCSSVariables() {
  const root = document.documentElement;
  const config = currentState.config;
  
  root.style.setProperty('--menu-bg-color', config.menuBgColor);
  root.style.setProperty('--item-color', config.itemColor);
  root.style.setProperty('--item-hover-color', config.itemHoverColor);
  root.style.setProperty('--item-hover-bg', hexToRgba(config.itemHoverColor, 0.08));
  root.style.setProperty('--item-active-color', config.itemActiveColor);
  root.style.setProperty('--item-active-bg', config.itemActiveBg);
  root.style.setProperty('--icon-size', config.iconSize);
  root.style.setProperty('--font-size', config.fontSize);
  root.style.setProperty('--font-family', config.fontFamily);
  root.style.setProperty('--menu-padding', `${config.menuPadding}px`);
  root.style.setProperty('--item-spacing', `${config.itemSpacing}px`);
  root.style.setProperty('--border-radius', `${config.borderRadius}px`);
  root.style.setProperty('--animation-duration', `${config.animationDuration}ms`);
  root.style.setProperty('--submenu-bg-color', config.submenuBgColor);
  root.style.setProperty('--submenu-indent', `${config.submenuIndent}px`);
  root.style.setProperty('--divider-color', config.dividerColor);
  
  // Shadow
  if (config.showShadow) {
    root.style.setProperty('--menu-shadow', '0 2px 8px rgba(0, 0, 0, 0.1)');
  } else {
    root.style.setProperty('--menu-shadow', 'none');
  }
}

// Converter hex para rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Mostrar erro
function showError(message) {
  const container = document.getElementById('menu-container');
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; color: #d32f2f; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
        <div style="font-weight: 600; margin-bottom: 5px;">Erro</div>
        <div style="font-size: 14px;">${message}</div>
      </div>
    `;
  }
}

// Listener de mensagens do Looker Studio
window.addEventListener('message', (event) => {
  // Processar mensagens do Looker Studio
  if (event.data && event.data.type === 'looker-studio-data') {
    drawViz(event.data.payload);
  }
});

// Integração com DSCC (Looker Studio Community Component Library)
if (typeof dscc !== 'undefined') {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
} else {
  // Modo de desenvolvimento - usar dados de exemplo
  console.log('Modo de desenvolvimento - DSCC não disponível');
  
  // Simular dados para desenvolvimento
  setTimeout(() => {
    drawViz({
      style: {
        menuOrientation: 'horizontal',
        menuStyle: 'modern',
        showIcons: true,
        menuItems: JSON.stringify(getDefaultMenuItems())
      }
    });
  }, 100);
}

// Exportar para uso global
window.LookerMenuViz = {
  drawViz,
  navigateToPage,
  getCurrentPage: () => currentState.activePage,
  getMenuItems: () => currentState.menuItems
};
