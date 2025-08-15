// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import catppuccin from "@catppuccin/starlight";
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Vluv\'s Wiki',
			plugins: [catppuccin({
				dark: { flavor: "mocha", accent: "lavender" },
				light: { flavor: "latte", accent: "lavender" },
			})],
			expressiveCode: {
				themes: ['catppuccin-mocha', 'catppuccin-latte'],
				plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
				styleOverrides: {
					uiFontFamily: "Maple Mono CN, Maple Mono NF CN, monospace"
				}
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Efterklang' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'About', slug: 'guides/example' },
					],
				},
				{
					label: 'Java',
					autogenerate: { directory: 'Java' },
				},
        {
					label: 'ARM',
					autogenerate: { directory: 'ARM-Processor' },
				},
			],
		}),
	],
});
