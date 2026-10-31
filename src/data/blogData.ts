export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  category: string;
  tags: string;
  excerpt: string;
  quote: string;
  paragraphs: string[];
  commentsCount: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "fruits-veg-nutrients",
    slug: "fruits-and-vegetable-nutrients-for-your-health",
    title: "Fruits & Vegetable Nutrients For Your Health",
    author: "Ramamoorthi M",
    date: "March 22, 2020",
    image: "/blog/blog-fruits-veg.webp",
    category: "Organic",
    tags: "Fruits, Super Market",
    excerpt:
      "Dolor sit amet consectetur adip elit. Nulla malesuada pellentesque elit eget gravida cum sociis. Integer vitae justo eget magna fermentum iaculis eu. Enim ut tellus elementum sagittis vitae et. Tellus molestie...",
    quote:
      "“Est sit amet ultricies leo consequat mauris. . Non enim praesent elementum facilisis leo vel fringilla. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada.”",
    paragraphs: [
      "Nunc id cursus metus aliquam eleifend mi in nulla. Aliquam sem et tortor consequat. Arcu odio ut sem nulla. Pharetra magna ac placerat vestibulum. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse.",
      "Sapien faucibus et molestie ac feugiat sed lectus. Sit amet consectetur adipiscing elit. Sed cras ornare arcu dui vivamus arcu felis. A scelerisque purus semper eget duis at tellus at urna. Vitae congue mauris rhoncus aenean vel elit. Sapien faucibus et molestie ac feugiat.",
      "Id semper risus in hendrerit gravida rutrum quisque non tellus. Sed lectus vestibulum mattis ullamcorper. Amet venenatis urna cursus eget nunc. Eu augue ut lectus arcu. Fermentum iaculis eu non diam phasellus vestibulum lorem sed risus. Amet venenatis urna cursus eget nunc.",
      "Massa vitae tortor condimentum lacinia quis vel eros donec ac. Enim ut tellus elementum sagittis vitae. Massa sapien faucibus et molestie ac feugiat. Tincidunt ornare massa eget egestas purus viverra accumsan. Metus aliquam eleifend mi in nulla posuere.",
    ],
    commentsCount: 1,
  },
  {
    id: "dry-fruits-nuts",
    slug: "best-way-to-eat-dry-fruits-and-nuts",
    title: "Best Way To Eat Dry Fruits And Nuts",
    author: "Ramamoorthi M",
    date: "March 25, 2020",
    image: "/blog/blog-dry-fruits.webp",
    category: "Healthy Living",
    tags: "Seeds, Super Market",
    excerpt:
      "Nunc id cursus metus aliquam eleifend mi in nulla. Aliquam sem et tortor consequat. Arcu odio ut sem nulla. Pharetra magna ac placerat vestibulum. Potenti nullam ac tortor vitae purus...",
    quote:
      "“Est sit amet ultricies leo consequat mauris. . Non enim praesent elementum facilisis leo vel fringilla. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada.”",
    paragraphs: [
      "Nunc id cursus metus aliquam eleifend mi in nulla. Aliquam sem et tortor consequat. Arcu odio ut sem nulla. Pharetra magna ac placerat vestibulum. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse.",
      "Sapien faucibus et molestie ac feugiat sed lectus. Sit amet consectetur adipiscing elit. Sed cras ornare arcu dui vivamus arcu felis. A scelerisque purus semper eget duis at tellus at urna. Vitae congue mauris rhoncus aenean vel elit. Sapien faucibus et molestie ac feugiat.",
      "Id semper risus in hendrerit gravida rutrum quisque non tellus. Sed lectus vestibulum mattis ullamcorper. Amet venenatis urna cursus eget nunc. Eu augue ut lectus arcu. Fermentum iaculis eu non diam phasellus vestibulum lorem sed risus. Amet venenatis urna cursus eget nunc.",
      "Massa vitae tortor condimentum lacinia quis vel eros donec ac. Enim ut tellus elementum sagittis vitae. Massa sapien faucibus et molestie ac feugiat. Tincidunt ornare massa eget egestas purus viverra accumsan. Metus aliquam eleifend mi in nulla posuere.",
    ],
    commentsCount: 1,
  },
  {
    id: "meat-seafood",
    slug: "best-in-quality-fresh-meat-and-seafood",
    title: "Best In Quality Fresh Meat & Seafood",
    author: "Ramamoorthi M",
    date: "March 26, 2020",
    image: "/blog/blog-meat-seafood.webp",
    category: "Fresh Food",
    tags: "Meat, Seafood, Super Market",
    excerpt:
      "Turpis nunc eget lorem dolor. Pretium quam vulputate dignissim suspendisse in est ante. Varius duis at consectetur lorem donec. Praesent semper feugiat nibh sed pulvinar proin. Suspendisse faucibus interdum posuere...",
    quote:
      "“Est sit amet ultricies leo consequat mauris. . Non enim praesent elementum facilisis leo vel fringilla. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada.”",
    paragraphs: [
      "Nunc id cursus metus aliquam eleifend mi in nulla. Aliquam sem et tortor consequat. Arcu odio ut sem nulla. Pharetra magna ac placerat vestibulum. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse.",
      "Sapien faucibus et molestie ac feugiat sed lectus. Sit amet consectetur adipiscing elit. Sed cras ornare arcu dui vivamus arcu felis. A scelerisque purus semper eget duis at tellus at urna. Vitae congue mauris rhoncus aenean vel elit. Sapien faucibus et molestie ac feugiat.",
      "Id semper risus in hendrerit gravida rutrum quisque non tellus. Sed lectus vestibulum mattis ullamcorper. Amet venenatis urna cursus eget nunc. Eu augue ut lectus arcu. Fermentum iaculis eu non diam phasellus vestibulum lorem sed risus. Amet venenatis urna cursus eget nunc.",
      "Massa vitae tortor condimentum lacinia quis vel eros donec ac. Enim ut tellus elementum sagittis vitae. Massa sapien faucibus et molestie ac feugiat. Tincidunt ornare massa eget egestas purus viverra accumsan. Metus aliquam eleifend mi in nulla posuere.",
    ],
    commentsCount: 1,
  },
];

export function getBlogPostBySlug(slugOrId: string): BlogPost | undefined {
  return BLOG_POSTS.find(
    (post) =>
      post.slug.toLowerCase() === slugOrId.toLowerCase() ||
      post.id.toLowerCase() === slugOrId.toLowerCase()
  );
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}
