import React from 'react';
import { BlogPage } from './blog/BlogPage';

interface StandaloneBlogProps {
  onBack?: () => void;
}

export const StandaloneBlog: React.FC<StandaloneBlogProps> = ({ onBack }) => {
  return <BlogPage onBack={onBack} />;
};