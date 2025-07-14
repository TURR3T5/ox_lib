import { Components } from 'react-markdown';
import { cn } from '@/lib/utils';

const MarkdownComponents: Components = {
  h1: ({ node, className, ...props }) => <h1 className={cn('text-2xl font-bold', className)} {...props} />,
  h2: ({ node, className, ...props }) => <h2 className={cn('text-xl font-semibold', className)} {...props} />,
  h3: ({ node, className, ...props }) => <h3 className={cn('text-lg font-medium', className)} {...props} />,
};

export default MarkdownComponents;
