// import { emerald, black } from 'tailwindcss/colors';




// module.exports = {
//     darkMode: ['class'],
//     content: [
//     './app/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//   	extend: {
//   		borderRadius: {
//   			lg: 'var(--radius)',
//   			md: 'calc(var(--radius) - 2px)',
//   			sm: 'calc(var(--radius) - 4px)'
//   		},
//   		colors: {
//   			// background: 'hsl(var(--background))',
//   			background: '#060b17',
//   			foreground: '#ffffff',
//   			card: {
//   				DEFAULT: 'hsl(var(--card))',
//   				foreground: 'hsl(var(--card-foreground))'
//   			},
//   			popover: {
//   				DEFAULT: 'hsl(var(--popover))',
//   				foreground: 'hsl(var(--popover-foreground))'
//   			},
//   			primary: {
//   				// DEFAULT: 'hsl(var(--primary))',
//   				DEFAULT: emerald[500],
//   				foreground: black
//   			},
//   			secondary: {
//   				DEFAULT: 'hsl(var(--secondary))',
//   				foreground: 'hsl(var(--secondary-foreground))'
//   			},
//   			muted: {
//   				DEFAULT: 'hsl(var(--muted))',
//   				foreground: 'hsl(var(--muted-foreground))'
//   			},
//   			accent: {
//   				DEFAULT: 'hsl(var(--accent))',
//   				foreground: 'hsl(var(--accent-foreground))'
//   			},
//   			destructive: {
//   				DEFAULT: 'hsl(var(--destructive))',
//   				foreground: 'hsl(var(--destructive-foreground))'
//   			},
//   			border: 'hsl(var(--border))',
//   			input: 'hsl(var(--input))',
//   			ring: 'hsl(var(--ring))',
//   			chart: {
//   				'1': 'hsl(var(--chart-1))',
//   				'2': 'hsl(var(--chart-2))',
//   				'3': 'hsl(var(--chart-3))',
//   				'4': 'hsl(var(--chart-4))',
//   				'5': 'hsl(var(--chart-5))'
//   			}
//   		}
//   	}
//   },
//   plugins: [require("tailwindcss-animate")],
// };


import { emerald, gray, red, slate } from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      colors: {
        background: '#060b17',         // Your specified dark background
        foreground: slate[100],        // Light text for good contrast

        card: {
          DEFAULT: '#0c1324',         // Slightly lighter than background
          foreground: slate[100],
        },

        popover: {
          DEFAULT: '#0c1324',
          foreground: slate[100],
        },

        primary: {
          DEFAULT: emerald[500],      // Emerald as brand color
          foreground: 'white',
        },

        secondary: {
          DEFAULT: slate[700],
          foreground: slate[100],
        },

        muted: {
          DEFAULT: slate[800],
          foreground: slate[400],
        },

        accent: {
          DEFAULT: emerald[700],
          foreground: emerald[400],
        },

        destructive: {
          DEFAULT: red[600],
          foreground: 'white',
        },

        border: slate[700],            // Subtle border color
        input: slate[700],             // Input borders
        ring: emerald[500],            // Ring highlight color

        chart: {
          1: emerald[500],
          2: emerald[400],
          3: emerald[300],
          4: emerald[200],
          5: emerald[100],
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
