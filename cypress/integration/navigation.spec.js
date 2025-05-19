describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Test de la navigation principale
  describe('Main Navigation', () => {
    it('should navigate to all main sections', () => {
      // Accueil
      cy.get('nav').contains('Accueil').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');

      // Blog
      cy.get('nav').contains('Blog').click();
      cy.url().should('include', '/blog');
      cy.get('h1').should('contain', 'Blog');

      // Livres
      cy.get('nav').contains('Livres').click();
      cy.url().should('include', '/books');
      cy.get('h1').should('contain', 'Livres');

      // Contact
      cy.get('nav').contains('Contact').click();
      cy.url().should('include', '/contact');
      cy.get('h1').should('contain', 'Contact');
    });

    it('should handle mobile navigation', () => {
      // Simuler un écran mobile
      cy.viewport('iphone-6');

      // Vérifier que le menu burger est visible
      cy.get('[data-testid="menu-button"]').should('be.visible');

      // Ouvrir le menu
      cy.get('[data-testid="menu-button"]').click();
      cy.get('[data-testid="mobile-menu"]').should('be.visible');

      // Vérifier la navigation mobile
      cy.get('[data-testid="mobile-menu"]').contains('Blog').click();
      cy.url().should('include', '/blog');
    });
  });

  // Test des transitions de page
  describe('Page Transitions', () => {
    it('should have smooth transitions between pages', () => {
      cy.get('nav').contains('Blog').click();
      cy.get('[data-testid="page-transition"]').should('exist');
      cy.url().should('include', '/blog');
    });

    it('should maintain scroll position after navigation', () => {
      // Aller à la page blog
      cy.get('nav').contains('Blog').click();

      // Faire défiler la page
      cy.scrollTo('bottom');
      const scrollPosition = cy.window().its('scrollY');

      // Naviguer vers une autre page
      cy.get('nav').contains('Accueil').click();

      // Revenir à la page blog
      cy.get('nav').contains('Blog').click();

      // Vérifier la position de défilement
      cy.window().its('scrollY').should('eq', scrollPosition);
    });
  });

  // Test de la navigation des articles
  describe('Article Navigation', () => {
    it('should navigate to article details', () => {
      cy.get('nav').contains('Blog').click();
      cy.get('[data-testid="article-card"]').first().click();
      cy.url().should('include', '/blog/articles/');
      cy.get('article').should('exist');
    });

    it('should handle article pagination', () => {
      cy.get('nav').contains('Blog').click();
      cy.get('[data-testid="pagination"]').should('exist');
      cy.get('[data-testid="pagination"]').contains('2').click();
      cy.url().should('include', 'page=2');
    });
  });

  // Test de la navigation des livres
  describe('Book Navigation', () => {
    it('should navigate to book details', () => {
      cy.get('nav').contains('Livres').click();
      cy.get('[data-testid="book-card"]').first().click();
      cy.url().should('include', '/books/');
      cy.get('article').should('exist');
    });

    it('should filter books by category', () => {
      cy.get('nav').contains('Livres').click();
      cy.get('[data-testid="category-filter"]').first().click();
      cy.get('[data-testid="book-card"]').should('have.length.gt', 0);
    });
  });

  // Test de la navigation du footer
  describe('Footer Navigation', () => {
    it('should navigate to all footer links', () => {
      // Liens sociaux
      cy.get('footer').contains('GitHub').click();
      cy.url().should('include', 'github.com');

      // Liens légaux
      cy.get('footer').contains('Mentions légales').click();
      cy.url().should('include', '/mentions-legales');
    });
  });

  // Test de la navigation avec le bouton retour
  describe('Back Button Navigation', () => {
    it('should navigate back correctly', () => {
      cy.get('nav').contains('Blog').click();
      cy.get('[data-testid="article-card"]').first().click();
      cy.get('[data-testid="back-button"]').click();
      cy.url().should('include', '/blog');
    });
  });

  // Test de la navigation avec le bouton retour en haut
  describe('Back to Top Button', () => {
    it('should scroll to top when clicked', () => {
      cy.get('nav').contains('Blog').click();
      cy.scrollTo('bottom');
      cy.get('[data-testid="back-to-top"]').click();
      cy.window().its('scrollY').should('eq', 0);
    });
  });
});
