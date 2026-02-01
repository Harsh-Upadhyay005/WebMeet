import React from 'react'
import { useThemeStore } from '../store/useThemeStore.js'
import { Palette, PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants/index.js';

const ThemeSelector = () => {
  const {theme, setTheme} = useThemeStore();
  return (
    <div className='dropdown dropdown-end'>
      {/* Dropdown Trigger */}
      <button tabIndex={0} role="button" className='btn btn-ghost btn-circle'>
        <Palette className='size-5' />
      </button>
      
      <ul
        tabIndex={0}
        className='dropdown-content menu mt-2 p-2 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 border border-base-content/10 max-h-80 overflow-y-auto z-[1] flex flex-row'
        >
            {THEMES.map((themeOption) => (
              <li key={themeOption.name} className='w-full'>
                <a
                  className={`
                    w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors justify-start
                    ${
                      theme === themeOption.name
                      ? "bg-primary/10 text-primary active"
                      : "hover:bg-base-content/5"
                    }
                  `}
                  onClick={() => setTheme(themeOption.name)}
                >
                  <PaletteIcon className='size-4' />
                  <span className='text-sm font-medium'>{themeOption.label}</span>
                  {/* Theme Preview Colors */}
                  <div className='ml-auto flex gap-1'>
                    {themeOption.colors.map((color, index) => (
                      <span
                        key={index}
                        className='size-2 rounded-full'
                        style={{backgroundColor: color}}
                      />
                    ))}
                  </div>
                </a>
              </li>
            ))}
      </ul>
    </div>
  )
}

export default ThemeSelector;