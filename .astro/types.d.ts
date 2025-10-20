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
"articles-generaux/comment-planifier-mon-travail.md": {
	id: "articles-generaux/comment-planifier-mon-travail.md";
  slug: "articles-generaux/comment-planifier-mon-travail";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"articles-generaux/premier-article.md": {
	id: "articles-generaux/premier-article.md";
  slug: "articles-generaux/premier-article";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"articles-generaux/synthese-thematiques.md": {
	id: "articles-generaux/synthese-thematiques.md";
  slug: "articles-generaux/synthese-thematiques";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"articles-generaux/template-article.md": {
	id: "articles-generaux/template-article.md";
  slug: "articles-generaux/template-article";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-commercial/negocier-salaire-techniques-avancees.md": {
	id: "developpement-commercial/negocier-salaire-techniques-avancees.md";
  slug: "developpement-commercial/negocier-salaire-techniques-avancees";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-commercial/recrutement-talents-digitaux.md": {
	id: "developpement-commercial/recrutement-talents-digitaux.md";
  slug: "developpement-commercial/recrutement-talents-digitaux";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/frameworks-javascript-analyse-2024.md": {
	id: "developpement-web/frameworks-javascript-analyse-2024.md";
  slug: "developpement-web/frameworks-javascript-analyse-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/frameworks-javascript-comparaison-2024.md": {
	id: "developpement-web/frameworks-javascript-comparaison-2024.md";
  slug: "developpement-web/frameworks-javascript-comparaison-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/progressive-web-apps-2024.md": {
	id: "developpement-web/progressive-web-apps-2024.md";
  slug: "developpement-web/progressive-web-apps-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/react-performance-optimisation.md": {
	id: "developpement-web/react-performance-optimisation.md";
  slug: "developpement-web/react-performance-optimisation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/technologies-javascript-2024.md": {
	id: "developpement-web/technologies-javascript-2024.md";
  slug: "developpement-web/technologies-javascript-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/tendances-developpement-web-2025.md": {
	id: "developpement-web/tendances-developpement-web-2025.md";
  slug: "developpement-web/tendances-developpement-web-2025";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/web-accessibilite-guide-pratique.md": {
	id: "developpement-web/web-accessibilite-guide-pratique.md";
  slug: "developpement-web/web-accessibilite-guide-pratique";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/web-javascript-modern.md": {
	id: "developpement-web/web-javascript-modern.md";
  slug: "developpement-web/web-javascript-modern";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"developpement-web/web-tendances-2024.md": {
	id: "developpement-web/web-tendances-2024.md";
  slug: "developpement-web/web-tendances-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/apprentissage-continu-developpement-competences.md": {
	id: "formation/apprentissage-continu-developpement-competences.md";
  slug: "formation/apprentissage-continu-developpement-competences";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-adaptation.md": {
	id: "formation/formation-adaptation.md";
  slug: "formation/formation-adaptation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-collaboration.md": {
	id: "formation/formation-collaboration.md";
  slug: "formation/formation-collaboration";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-communication.md": {
	id: "formation/formation-communication.md";
  slug: "formation/formation-communication";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-creativite.md": {
	id: "formation/formation-creativite.md";
  slug: "formation/formation-creativite";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-elearning.md": {
	id: "formation/formation-elearning.md";
  slug: "formation/formation-elearning";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-equipes-commerciales.md": {
	id: "formation/formation-equipes-commerciales.md";
  slug: "formation/formation-equipes-commerciales";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-innovation.md": {
	id: "formation/formation-innovation.md";
  slug: "formation/formation-innovation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-mentorat.md": {
	id: "formation/formation-mentorat.md";
  slug: "formation/formation-mentorat";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-professionnelle-continue.md": {
	id: "formation/formation-professionnelle-continue.md";
  slug: "formation/formation-professionnelle-continue";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-soft-skills.md": {
	id: "formation/formation-soft-skills.md";
  slug: "formation/formation-soft-skills";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-talents-guide.md": {
	id: "formation/formation-talents-guide.md";
  slug: "formation/formation-talents-guide";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/formation-technique.md": {
	id: "formation/formation-technique.md";
  slug: "formation/formation-technique";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/impact-formation-continue-carriere.md": {
	id: "formation/impact-formation-continue-carriere.md";
  slug: "formation/impact-formation-continue-carriere";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"formation/mentoring-developpement-professionnel.md": {
	id: "formation/mentoring-developpement-professionnel.md";
  slug: "formation/mentoring-developpement-professionnel";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-connaissances/gestion-connaissances-organisation.md": {
	id: "gestion-connaissances/gestion-connaissances-organisation.md";
  slug: "gestion-connaissances/gestion-connaissances-organisation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/agile-scrum-methodologies.md": {
	id: "gestion-projet/agile-scrum-methodologies.md";
  slug: "gestion-projet/agile-scrum-methodologies";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-performance-equipe.md": {
	id: "gestion-projet/gestion-performance-equipe.md";
  slug: "gestion-projet/gestion-performance-equipe";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-performance-evaluation.md": {
	id: "gestion-projet/gestion-performance-evaluation.md";
  slug: "gestion-projet/gestion-performance-evaluation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-projet-agile-meilleures-pratiques.md": {
	id: "gestion-projet/gestion-projet-agile-meilleures-pratiques.md";
  slug: "gestion-projet/gestion-projet-agile-meilleures-pratiques";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-projet-agile.md": {
	id: "gestion-projet/gestion-projet-agile.md";
  slug: "gestion-projet/gestion-projet-agile";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-projet-performance.md": {
	id: "gestion-projet/gestion-projet-performance.md";
  slug: "gestion-projet/gestion-projet-performance";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-projet-risques.md": {
	id: "gestion-projet/gestion-projet-risques.md";
  slug: "gestion-projet/gestion-projet-risques";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-projet/gestion-risques-projet.md": {
	id: "gestion-projet/gestion-risques-projet.md";
  slug: "gestion-projet/gestion-risques-projet";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-competences-developpement.md": {
	id: "gestion-talents/gestion-competences-developpement.md";
  slug: "gestion-talents/gestion-competences-developpement";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-conflits-equipe.md": {
	id: "gestion-talents/gestion-conflits-equipe.md";
  slug: "gestion-talents/gestion-conflits-equipe";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-attraction.md": {
	id: "gestion-talents/gestion-talents-attraction.md";
  slug: "gestion-talents/gestion-talents-attraction";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-developpement.md": {
	id: "gestion-talents/gestion-talents-developpement.md";
  slug: "gestion-talents/gestion-talents-developpement";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-fidelisation.md": {
	id: "gestion-talents/gestion-talents-fidelisation.md";
  slug: "gestion-talents/gestion-talents-fidelisation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-formation.md": {
	id: "gestion-talents/gestion-talents-formation.md";
  slug: "gestion-talents/gestion-talents-formation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-performance.md": {
	id: "gestion-talents/gestion-talents-performance.md";
  slug: "gestion-talents/gestion-talents-performance";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-recrutement.md": {
	id: "gestion-talents/gestion-talents-recrutement.md";
  slug: "gestion-talents/gestion-talents-recrutement";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-remuneration.md": {
	id: "gestion-talents/gestion-talents-remuneration.md";
  slug: "gestion-talents/gestion-talents-remuneration";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-retention.md": {
	id: "gestion-talents/gestion-talents-retention.md";
  slug: "gestion-talents/gestion-talents-retention";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-succession.md": {
	id: "gestion-talents/gestion-talents-succession.md";
  slug: "gestion-talents/gestion-talents-succession";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-valuation.md": {
	id: "gestion-talents/gestion-talents-valuation.md";
  slug: "gestion-talents/gestion-talents-valuation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-whistleblowing.md": {
	id: "gestion-talents/gestion-talents-whistleblowing.md";
  slug: "gestion-talents/gestion-talents-whistleblowing";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-xenophobia.md": {
	id: "gestion-talents/gestion-talents-xenophobia.md";
  slug: "gestion-talents/gestion-talents-xenophobia";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-youth.md": {
	id: "gestion-talents/gestion-talents-youth.md";
  slug: "gestion-talents/gestion-talents-youth";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"gestion-talents/gestion-talents-zen.md": {
	id: "gestion-talents/gestion-talents-zen.md";
  slug: "gestion-talents/gestion-talents-zen";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"innovation-technologies/ia-transformation-societe-2024-analyse.md": {
	id: "innovation-technologies/ia-transformation-societe-2024-analyse.md";
  slug: "innovation-technologies/ia-transformation-societe-2024-analyse";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"innovation-technologies/ia-transformation-societe-2024.md": {
	id: "innovation-technologies/ia-transformation-societe-2024.md";
  slug: "innovation-technologies/ia-transformation-societe-2024";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"innovation-technologies/intelligence-artificielle-transformation-marketing.md": {
	id: "innovation-technologies/intelligence-artificielle-transformation-marketing.md";
  slug: "innovation-technologies/intelligence-artificielle-transformation-marketing";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"innovation-technologies/nouvelles-tendances-developpement-web.md": {
	id: "innovation-technologies/nouvelles-tendances-developpement-web.md";
  slug: "innovation-technologies/nouvelles-tendances-developpement-web";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"leadership-management/formation-leadership.md": {
	id: "leadership-management/formation-leadership.md";
  slug: "leadership-management/formation-leadership";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"leadership-management/importance-leadership.md": {
	id: "leadership-management/importance-leadership.md";
  slug: "leadership-management/importance-leadership";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"leadership-management/leadership-equipes-performance.md": {
	id: "leadership-management/leadership-equipes-performance.md";
  slug: "leadership-management/leadership-equipes-performance";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"leadership-management/management-diversite-inclusion.md": {
	id: "leadership-management/management-diversite-inclusion.md";
  slug: "leadership-management/management-diversite-inclusion";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"leadership-management/management-hybride-defis-opportunites.md": {
	id: "leadership-management/management-hybride-defis-opportunites.md";
  slug: "leadership-management/management-hybride-defis-opportunites";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"marketing-communication/email-marketing-personnalisation.md": {
	id: "marketing-communication/email-marketing-personnalisation.md";
  slug: "marketing-communication/email-marketing-personnalisation";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"marketing-communication/marketing-content-strategies.md": {
	id: "marketing-communication/marketing-content-strategies.md";
  slug: "marketing-communication/marketing-content-strategies";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"marketing-communication/marketing-digital-strategies.md": {
	id: "marketing-communication/marketing-digital-strategies.md";
  slug: "marketing-communication/marketing-digital-strategies";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"marketing-communication/strategies-marketing-digital-2025.md": {
	id: "marketing-communication/strategies-marketing-digital-2025.md";
  slug: "marketing-communication/strategies-marketing-digital-2025";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"marketing-communication/strategies-reseaux-sociaux-b2b.md": {
	id: "marketing-communication/strategies-reseaux-sociaux-b2b.md";
  slug: "marketing-communication/strategies-reseaux-sociaux-b2b";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"marketing-communication/strategies-reseaux-sociaux-entreprises.md": {
	id: "marketing-communication/strategies-reseaux-sociaux-entreprises.md";
  slug: "marketing-communication/strategies-reseaux-sociaux-entreprises";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"outils-techniques/mermaid-example.md": {
	id: "outils-techniques/mermaid-example.md";
  slug: "outils-techniques/mermaid-example";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"outils-techniques/pillcolor-guide.md": {
	id: "outils-techniques/pillcolor-guide.md";
  slug: "outils-techniques/pillcolor-guide";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"outils-techniques/visualisations-mermaid.md": {
	id: "outils-techniques/visualisations-mermaid.md";
  slug: "outils-techniques/visualisations-mermaid";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/deep-work.md": {
	id: "productivite-methodes/deep-work.md";
  slug: "productivite-methodes/deep-work";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/gestion-priorites-efficacite.md": {
	id: "productivite-methodes/gestion-priorites-efficacite.md";
  slug: "productivite-methodes/gestion-priorites-efficacite";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/gestion-stress-performance.md": {
	id: "productivite-methodes/gestion-stress-performance.md";
  slug: "productivite-methodes/gestion-stress-performance";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/gestion-surcharge-informationnelle.md": {
	id: "productivite-methodes/gestion-surcharge-informationnelle.md";
  slug: "productivite-methodes/gestion-surcharge-informationnelle";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/gestion-temps-productivite.md": {
	id: "productivite-methodes/gestion-temps-productivite.md";
  slug: "productivite-methodes/gestion-temps-productivite";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/gestion-temps-professionnels.md": {
	id: "productivite-methodes/gestion-temps-professionnels.md";
  slug: "productivite-methodes/gestion-temps-professionnels";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/gestion-temps.md": {
	id: "productivite-methodes/gestion-temps.md";
  slug: "productivite-methodes/gestion-temps";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/methode-gtd-expliquee.md": {
	id: "productivite-methodes/methode-gtd-expliquee.md";
  slug: "productivite-methodes/methode-gtd-expliquee";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/methode-pomodoro.md": {
	id: "productivite-methodes/methode-pomodoro.md";
  slug: "productivite-methodes/methode-pomodoro";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/procrastination-solutions-efficaces.md": {
	id: "productivite-methodes/procrastination-solutions-efficaces.md";
  slug: "productivite-methodes/procrastination-solutions-efficaces";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"productivite-methodes/productivite-professionnelle.md": {
	id: "productivite-methodes/productivite-professionnelle.md";
  slug: "productivite-methodes/productivite-professionnelle";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/gestion-qualite-amelioration.md": {
	id: "qualite-process/gestion-qualite-amelioration.md";
  slug: "qualite-process/gestion-qualite-amelioration";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/gestion-qualite-certification.md": {
	id: "qualite-process/gestion-qualite-certification.md";
  slug: "qualite-process/gestion-qualite-certification";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/gestion-qualite-entreprise.md": {
	id: "qualite-process/gestion-qualite-entreprise.md";
  slug: "qualite-process/gestion-qualite-entreprise";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/gestion-qualite-processus.md": {
	id: "qualite-process/gestion-qualite-processus.md";
  slug: "qualite-process/gestion-qualite-processus";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/gestion-qualite-strategie.md": {
	id: "qualite-process/gestion-qualite-strategie.md";
  slug: "qualite-process/gestion-qualite-strategie";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/optimisation-processus-entreprise.md": {
	id: "qualite-process/optimisation-processus-entreprise.md";
  slug: "qualite-process/optimisation-processus-entreprise";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"qualite-process/qualite-processus-entreprise.md": {
	id: "qualite-process/qualite-processus-entreprise.md";
  slug: "qualite-process/qualite-processus-entreprise";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"reconversion-carriere/reconversion-professionnelle-reussie.md": {
	id: "reconversion-carriere/reconversion-professionnelle-reussie.md";
  slug: "reconversion-carriere/reconversion-professionnelle-reussie";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"service-client/service-client-excellence.md": {
	id: "service-client/service-client-excellence.md";
  slug: "service-client/service-client-excellence";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"service-client/service-client-performance.md": {
	id: "service-client/service-client-performance.md";
  slug: "service-client/service-client-performance";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"transformation-digitale/transformation-digitale-telecom.md": {
	id: "transformation-digitale/transformation-digitale-telecom.md";
  slug: "transformation-digitale/transformation-digitale-telecom";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"transformation-digitale/transformation-numerique-entreprise.md": {
	id: "transformation-digitale/transformation-numerique-entreprise.md";
  slug: "transformation-digitale/transformation-numerique-entreprise";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"transformation-digitale/transformation-numerique-talents.md": {
	id: "transformation-digitale/transformation-numerique-talents.md";
  slug: "transformation-digitale/transformation-numerique-talents";
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
"business-development-manager.md": {
	id: "business-development-manager.md";
  slug: "business-development-manager";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
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
"plateforme-ecommerce-sfr.md": {
	id: "plateforme-ecommerce-sfr.md";
  slug: "plateforme-ecommerce-sfr";
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
"quality-process-manager.md": {
	id: "quality-process-manager.md";
  slug: "quality-process-manager";
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
"transformation-orange-business.md": {
	id: "transformation-orange-business.md";
  slug: "transformation-orange-business";
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
