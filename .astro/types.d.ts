declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"articles": {
"apprentissage-continu-developpement-competences.md": {
	id: "apprentissage-continu-developpement-competences.md";
  slug: "apprentissage-continu-developpement-competences";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"comment-planifier-mon-travail.md": {
	id: "comment-planifier-mon-travail.md";
  slug: "comment-planifier-mon-travail";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"email-marketing-personnalisation.md": {
	id: "email-marketing-personnalisation.md";
  slug: "email-marketing-personnalisation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"frameworks-javascript-analyse-2024.md": {
	id: "frameworks-javascript-analyse-2024.md";
  slug: "frameworks-javascript-analyse-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"frameworks-javascript-comparaison-2024.md": {
	id: "frameworks-javascript-comparaison-2024.md";
  slug: "frameworks-javascript-comparaison-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-conflits-equipe.md": {
	id: "gestion-conflits-equipe.md";
  slug: "gestion-conflits-equipe";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet-agile-meilleures-pratiques.md": {
	id: "gestion-projet-agile-meilleures-pratiques.md";
  slug: "gestion-projet-agile-meilleures-pratiques";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-temps-professionnels.md": {
	id: "gestion-temps-professionnels.md";
  slug: "gestion-temps-professionnels";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"ia-transformation-societe-2024-analyse.md": {
	id: "ia-transformation-societe-2024-analyse.md";
  slug: "ia-transformation-societe-2024-analyse";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"ia-transformation-societe-2024.md": {
	id: "ia-transformation-societe-2024.md";
  slug: "ia-transformation-societe-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"impact-formation-continue-carriere.md": {
	id: "impact-formation-continue-carriere.md";
  slug: "impact-formation-continue-carriere";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"importance-leadership.md": {
	id: "importance-leadership.md";
  slug: "importance-leadership";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"intelligence-artificielle-transformation-marketing.md": {
	id: "intelligence-artificielle-transformation-marketing.md";
  slug: "intelligence-artificielle-transformation-marketing";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"management-diversite-inclusion.md": {
	id: "management-diversite-inclusion.md";
  slug: "management-diversite-inclusion";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"management-hybride-defis-opportunites.md": {
	id: "management-hybride-defis-opportunites.md";
  slug: "management-hybride-defis-opportunites";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"mentoring-developpement-professionnel.md": {
	id: "mentoring-developpement-professionnel.md";
  slug: "mentoring-developpement-professionnel";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"methode-gtd-expliquee.md": {
	id: "methode-gtd-expliquee.md";
  slug: "methode-gtd-expliquee";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"negocier-salaire-techniques-avancees.md": {
	id: "negocier-salaire-techniques-avancees.md";
  slug: "negocier-salaire-techniques-avancees";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"nouvelles-tendances-developpement-web.md": {
	id: "nouvelles-tendances-developpement-web.md";
  slug: "nouvelles-tendances-developpement-web";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"premier-article.md": {
	id: "premier-article.md";
  slug: "premier-article";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"procrastination-solutions-efficaces.md": {
	id: "procrastination-solutions-efficaces.md";
  slug: "procrastination-solutions-efficaces";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"progressive-web-apps-2024.md": {
	id: "progressive-web-apps-2024.md";
  slug: "progressive-web-apps-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"reconversion-professionnelle-reussie.md": {
	id: "reconversion-professionnelle-reussie.md";
  slug: "reconversion-professionnelle-reussie";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"strategies-marketing-digital-2025.md": {
	id: "strategies-marketing-digital-2025.md";
  slug: "strategies-marketing-digital-2025";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"strategies-reseaux-sociaux-b2b.md": {
	id: "strategies-reseaux-sociaux-b2b.md";
  slug: "strategies-reseaux-sociaux-b2b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"technologies-javascript-2024.md": {
	id: "technologies-javascript-2024.md";
  slug: "technologies-javascript-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"web-accessibilite-guide-pratique.md": {
	id: "web-accessibilite-guide-pratique.md";
  slug: "web-accessibilite-guide-pratique";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
};
"books": {
"atomic-habits.md": {
	id: "atomic-habits.md";
  slug: "atomic-habits";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"clean-code.md": {
	id: "clean-code.md";
  slug: "clean-code";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"deep-work.md": {
	id: "deep-work.md";
  slug: "deep-work";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"eloquent-javascript.md": {
	id: "eloquent-javascript.md";
  slug: "eloquent-javascript";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"good-to-great.md": {
	id: "good-to-great.md";
  slug: "good-to-great";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"influence.md": {
	id: "influence.md";
  slug: "influence";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"lean-startup.md": {
	id: "lean-startup.md";
  slug: "lean-startup";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"zero-to-one.md": {
	id: "zero-to-one.md";
  slug: "zero-to-one";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
};
"docs": {
"guide-images-thematiques.md": {
	id: "guide-images-thematiques.md";
  slug: "guide-images-thematiques";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
};
"work": {
"former.md": {
	id: "former.md";
  slug: "former";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"nested/web-developer.md": {
	id: "nested/web-developer.md";
  slug: "nested/web-developer";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"project-manager.md": {
	id: "project-manager.md";
  slug: "project-manager";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"sales-team-manager.md": {
	id: "sales-team-manager.md";
  slug: "sales-team-manager";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"web-developer.md": {
	id: "web-developer.md";
  slug: "web-developer";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
