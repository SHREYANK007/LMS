// Consistent Design System for ScoreSmart LMS

export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      solid: 'indigo-600',
      hover: 'indigo-700'
    },

    // Status Colors
    success: {
      gradient: 'from-emerald-400 to-green-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-400'
    },

    info: {
      gradient: 'from-blue-400 to-cyan-500',
      text: 'text-blue-400',
      bg: 'bg-blue-400'
    },

    warning: {
      gradient: 'from-amber-400 to-orange-500',
      text: 'text-amber-400',
      bg: 'bg-amber-400'
    },

    danger: {
      gradient: 'from-red-400 to-pink-500',
      text: 'text-red-400',
      bg: 'bg-red-400'
    }
  },

  // Component Styles
  components: {
    // Stats Card (Dark Card Style)
    statCard: 'bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700',

    // Action Card (White Card Style)
    actionCard: 'bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer',

    // Content Card
    contentCard: 'bg-white rounded-2xl p-6 shadow-sm border border-slate-100',

    // Icon Container
    iconContainer: 'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg',
    iconContainerSmall: 'w-10 h-10 rounded-xl flex items-center justify-center',

    // Button Primary
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200',

    // Button Secondary
    buttonSecondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',

    // Input Field
    inputField: 'bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  },

  // Typography
  typography: {
    // Headings
    h1: 'text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent',
    h2: 'text-2xl font-bold text-slate-800',
    h3: 'text-xl font-bold text-slate-800',
    h4: 'text-lg font-semibold text-slate-800',

    // Body Text
    body: 'text-slate-600',
    bodySmall: 'text-sm text-slate-600',
    caption: 'text-xs text-slate-500',

    // Special Text
    subtitle: 'text-slate-500 text-lg',
    label: 'text-sm font-medium text-slate-700'
  },

  // Layout
  layout: {
    // Page Container
    pageContainer: 'min-h-screen',
    contentWrapper: 'p-8 max-w-7xl mx-auto',

    // Grid Systems
    statsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    actionsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    twoColumnGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-8',

    // Spacing
    sectionGap: 'mb-10',
    elementGap: 'mb-6'
  }
}

// Helper function to apply theme styles
export const getThemeClass = (componentType: keyof typeof theme.components) => {
  return theme.components[componentType]
}

// Helper function for gradients
export const getGradient = (type: 'primary' | 'success' | 'info' | 'warning' | 'danger') => {
  return `bg-gradient-to-br ${theme.colors[type].gradient}`
}

// Stats card with icon template
export const createStatCard = (stat: any) => {
  return `
    <div class="${theme.components.statCard}">
      <div class="flex items-center justify-between mb-4">
        <div class="${theme.components.iconContainerSmall} bg-gradient-to-br ${stat.iconBg}">
          <Icon class="w-5 h-5 text-white" />
        </div>
        <span class="text-sm font-bold ${stat.changeBg}">
          ${stat.change}
        </span>
      </div>
      <div class="text-3xl font-bold text-white mb-1">${stat.value}</div>
      <p class="text-sm text-slate-300">${stat.title}</p>
      <p class="text-xs text-slate-400 mt-2">${stat.description}</p>
    </div>
  `
}

// Action card template
export const createActionCard = (action: any) => {
  return `
    <div class="${theme.components.actionCard}">
      <div class="${theme.components.iconContainer} bg-gradient-to-br ${action.gradient}">
        <Icon class="w-7 h-7 text-white" />
      </div>
      <h3 class="${theme.typography.h4} mb-2">${action.title}</h3>
      <p class="${theme.typography.bodySmall} mb-4">${action.description}</p>
      <button class="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
        Explore
        <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  `
}