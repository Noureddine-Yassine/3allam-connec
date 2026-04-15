# M3allam Connect - Page d'Accueil Guide de Développement

## Vue d'ensemble

La page d'accueil de M3allam Connect est la porte d'entrée principale de la plateforme "Uber des artisans" au Maroc. Elle combine des éléments 3D interactifs, un système multilingue complet, et une expérience utilisateur optimisée pour la conversion.

## Architecture Technique


### Structure des Fichiers
```
app/
  page.tsx                 # Page d'accueil (server component)
components/
  HomeContent.tsx          # Contenu principal (client component)
  LanguageSwitcher.tsx     # Sélecteur de langue
  layout/
    Navbar.tsx            # Navigation avec i18n
    Footer.tsx             # Footer
  services3d/
    ServiceCarousel3D.tsx  # Carrousel 3D interactif
    interactive-carousel/
      ServiceCarousel3D.tsx # Carrousel 3D services
      utils.ts            # Utilitaires 3D
      styles.css          # Styles 3D
hooks/
  useDictionary.ts        # Hook i18n
lib/
  i18n/
    config.ts             # Configuration langues
    index.ts              # Export dictionnaires
    dictionaries/
      fr.json             # Traductions françaises
      en.json             # Traductions anglaises
      ar.json             # Traductions arabes
```

## Composants Principaux

### 1. HomeContent (Client Component)
**Fichier**: `components/HomeContent.tsx`

**Responsabilités**:
- Afficher le contenu principal de la page d'accueil
- Gérer le système de traduction i18n
- Intégrer le carrousel 3D
- Gérer les interactions utilisateur

**Structure**:
```typescript
export default function HomeContent() {
  const t = useDictionary(); // Hook i18n
  
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-4 overflow-hidden relative bg-transparent">
        {/* Language Switcher intégré */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        
        {/* Contenu hero avec 3D */}
        {/* ... */}
      </section>
      
      {/* SERVICES SECTION */}
      <section id="services" className="py-16 px-4 bg-[#B8CDD1]">
        {/* Grille de services */}
      </section>
      
      {/* HOW IT WORKS */}
      {/* TESTIMONIALS */}
      {/* CTA BANNER */}
    </div>
  );
}
```

### 2. ServiceCarousel3D (3D Component)
**Fichier**: `components/services3d/ServiceCarousel3D.tsx`

**Responsabilités**:
- Afficher un carrousel 3D interactif des services
- Gérer les interactions utilisateur (drag, click)
- Animer les transitions 3D fluides

**Technologies 3D**:
- React Three Fiber pour l'intégration React/Three.js
- React Three Drei pour les utilitaires 3D
- Géométries personnalisées (BentPlaneGeometry)
- Matériaux animés (MeshSineMaterial)

### 3. LanguageSwitcher (i18n Component)
**Fichier**: `components/LanguageSwitcher.tsx`

**Responsabilités**:
- Permettre le changement de langue
- Afficher les drapeaux et noms des langues
- Gérer le localStorage pour la persistance

**Langues supportées**:
- Français (FR) - Langue par défaut
- Anglais (EN)
- Arabe (AR) - Support RTL futur

## Système d'Internationalisation

### Hook useDictionary
**Fichier**: `hooks/useDictionary.ts`

```typescript
export function useDictionary(): Dictionary {
  const [dictionary, setDictionary] = useState<Dictionary>(getDictionary('fr'));
  
  useEffect(() => {
    // Écoute les changements de langue via localStorage
    const handleLocaleChange = () => {
      const newLocale = getLocaleFromStorage();
      setDictionary(getDictionary(newLocale));
    };
    
    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);
  
  return dictionary;
}
```

### Structure des Dictionnaires
Chaque fichier de traduction contient:

```json
{
  "common": { /* Éléments communs */ },
  "navigation": { /* Navigation */ },
  "home": {
    "hero": { /* Section hero */ },
    "services": { /* Section services */ },
    "howItWorks": { /* Comment ça marche */ },
    "testimonials": { /* Témoignages */ },
    "cta": { /* Call-to-action */ }
  },
  "request": { /* Page demande */ },
  "providers": { /* Page artisans */ }
}
```

## Sections de la Page

### 1. Hero Section
**Caractéristiques**:
- Titre principal avec mise en forme "M3allam" en vert
- Sous-titre descriptif
- Boutons CTA principaux et secondaires
- Statistiques (500+ artisans, 12 villes, 4.8/5)
- Carrousel 3D interactif côté droit
- Sélecteur de langue intégré

**Animations**:
- `animate-fade-in`: Apparition progressive
- `animate-pulse-glow`: Effet de pulsation sur CTA principal
- Transitions fluides sur les éléments

### 2. Services Section
**Caractéristiques**:
- ID "services" pour navigation ancrée
- Grille responsive (1/2/3 colonnes)
- 6 services principaux avec icônes
- Cartes interactives avec hover effects
- Lien vers page de demande

**Services**:
1. Plomberie (85 artisans)
2. Électricité (72 artisans)  
3. Peinture (64 artisans)
4. Menuiserie (58 artisans)
5. Nettoyage (93 artisans)
6. Climatisation (47 artisans)

### 3. How It Works Section
**Structure**:
- 3 étapes numérotées
- Icônes et descriptions
- Flèches de navigation (desktop)
- CTA final vers demande

### 4. Testimonials Section
**Caractéristiques**:
- 3 témoignages clients
- Système d'étoiles (5/5)
- Photos et informations client
- Tags de service

### 5. CTA Banner Section
**Objectif**:
- Conversion des artisans
- Inscription gratuite
- Validation sous 24h

## Design System

### Couleurs Principales
```css
--primary: #0B3B24;    /* Vert foncé M3allam */
--secondary: #4A8B71;  /* Vert clair */
--accent: #C2E0C6;     /* Vert très clair */
--background: #B8CDD1; /* Bleu-gris */
--text: #111827;       /* Noir */
--gray: #6B7280;       /* Gris moyen */
```

### Typographie
```css
font-family: Inter, system-ui, sans-serif;
font-weight: 900 (headings), 500 (body);
letter-spacing: tighter (headings);
```

### Animations CSS
```css
@keyframes fade-in { /* Apparition progressive */ }
@keyframes float-soft { /* Flottement doux */ }
@keyframes pulse-glow { /* Pulsation lumineuse */ }
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (1 colonne)
- **Tablet**: 768px - 1024px (2 colonnes)
- **Desktop**: > 1024px (3 colonnes)

### Adaptations
- Hero: Stack vertical sur mobile
- Services: Grille responsive
- Navigation: Menu hamburger sur mobile
- 3D Carousel: Adapté aux tailles d'écran

## Performance Optimisations

### Techniques Implémentées
- **Lazy Loading**: Images et composants 3D
- **Code Splitting**: Par route et composant
- **Tree Shaking**: Elimination code non utilisé
- **Memoization**: Hook useDictionary optimisé

### Recommandations
- Optimiser les textures 3D (WebP)
- Implémenter le prefetching des pages
- Ajouter le skeleton loading
- Optimiser les animations avec `will-change`

## Accessibilité

### Features Implémentées
- **WCAG 2.1 AA**: Compliance partielle
- **Keyboard Navigation**: Support complet
- **Screen Reader**: ARIA labels appropriés
- **Focus Management**: États visibles

### Améliorations Futures
- Support complet RTL (Arabe)
- High contrast mode
- Voice navigation
- Reduced motion preferences

## SEO Optimisation

### Meta Tags
```html
<title>M3allam Connect - Plateforme N°1 des artisans au Maroc</title>
<meta name="description" content="Trouvez des artisans qualifiés et vérifiés pour tous vos besoins à domicile, partout au Maroc." />
```

### Structured Data
- Schema.org LocalBusiness
- BreadcrumbList
- Review/Rating
- Service

## Développement Local

### Installation
```bash
npm install
npm run dev
```

### Variables d'Environnement
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Scripts Utiles
```bash
npm run dev          # Développement
npm run build        # Production
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript
```

## Déploiement

### Plateformes Supportées
- Vercel (Recommandé)
- Netlify
- AWS Amplify
- Docker

### Configuration Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## Debugging & Monitoring

### Outils Recommandés
- **React DevTools**: Debug composants
- **Chrome DevTools**: Performance et réseau
- **Lighthouse**: Audit performance
- **Sentry**: Error tracking

### Logs Importants
- Changements de langue
- Interactions 3D
- CTA clicks
- Erreurs i18n

## Contributing

### Guidelines
1. Suivre les conventions de nommage
2. Ajouter les traductions pour toutes les langues
3. Tester sur mobile et desktop
4. Valider l'accessibilité
5. Documenter les changements

### Pull Request Template
```markdown
## Description
## Changements
## Tests
## Screenshots
## Breaking Changes
```

## Roadmap Features

### Court Terme
- [ ] Support RTL complet (Arabe)
- [ ] Animations 3D améliorées
- [ ] Loading states
- [ ] Error boundaries

### Moyen Terme
- [ ] PWA features
- [ ] Offline support
- [ ] Voice search
- [ ] AI recommendations

### Long Terme
- [ ] WebXR/AR features
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Machine learning matching

---

**Note**: Ce guide est maintenu par l'équipe M3allam Connect. Pour toute question ou suggestion, contacter l'équipe de développement.
