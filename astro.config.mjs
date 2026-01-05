// @ts-check
import { defineConfig } from 'astro/config';
// import tailwind from '@astrojs/tailwind';
import starlight from '@astrojs/starlight';
import catppuccin from "@catppuccin/starlight";
import remarkMath from 'remark-math';
import remarkCallout from "@r4ai/remark-callout";
import rehypeMathJax from "rehype-mathjax"
// import wikiLinkPlugin from "@flowershow/remark-wiki-link"
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath, remarkCallout],
		rehypePlugins: [rehypeMathJax],
	},
	integrations: [
		starlight({
			title: 'Vluv\'s Wiki',
			customCss: ['./src/styles/callout.css'],
			plugins: [catppuccin({
				dark: { flavor: "mocha", accent: "lavender" },
				light: { flavor: "latte", accent: "lavender" },
			})],
			expressiveCode: {
				themes: ['catppuccin-mocha', 'catppuccin-latte'],
				plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
				styleOverrides: {
					uiFontFamily: "Maple Mono CN, Maple Mono NF CN, monospace",
					codeFontFamily: "Maple Mono NF CN, Maple Mono CN, monospace"
				}
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Efterklang' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'About', slug: 'guides/example' },
					],
				},
				{
					'label': 'Languages',
					autogenerate: { directory: 'Languages' },
				},
				{
					label: 'Algorithm',
					autogenerate: { directory: 'Algorithm' },
				},
				{
					label: 'ARM',
					autogenerate: { directory: 'ARM-Processor' },
				},
				{
					label: 'Network',
					autogenerate: { directory: '计网' },
				},
				{
					label: 'Linux',
					autogenerate: { directory: 'Linux' },
				}
			],
		}),
	],
});
