import React from 'react';
import { BlogPage } from './blog/BlogPage';

interface BlogShopeeProps {
  onBack: () => void;
}

export const BlogShopee: React.FC<BlogShopeeProps> = ({ onBack }) => {
  return <BlogPage onBack={onBack} />;
};