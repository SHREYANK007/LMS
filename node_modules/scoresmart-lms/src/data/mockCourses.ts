import { Course } from '@/types'

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    instructor: 'Dr. Sarah Wilson',
    instructorId: '2',
    thumbnail: '/demo-content/images/course1-thumb.jpg',
    duration: '8 weeks',
    level: 'beginner',
    price: 99.99,
    category: 'Web Development',
    enrolled: 156,
    rating: 4.8,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-15'),
    lessons: [
      {
        id: '1-1',
        title: 'HTML Basics',
        description: 'Introduction to HTML elements and structure',
        videoUrl: '/demo-content/videos/html-basics.mp4',
        duration: '45 min',
        order: 1
      },
      {
        id: '1-2',
        title: 'CSS Fundamentals',
        description: 'Styling web pages with CSS',
        videoUrl: '/demo-content/videos/css-fundamentals.mp4',
        duration: '60 min',
        order: 2
      },
      {
        id: '1-3',
        title: 'JavaScript Introduction',
        description: 'Getting started with JavaScript programming',
        videoUrl: '/demo-content/videos/js-intro.mp4',
        duration: '90 min',
        order: 3
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master React.js with hooks, context, and modern patterns for building scalable applications.',
    instructor: 'Prof. Michael Brown',
    instructorId: '3',
    thumbnail: '/demo-content/images/course2-thumb.jpg',
    duration: '12 weeks',
    level: 'advanced',
    price: 199.99,
    category: 'Frontend Development',
    enrolled: 89,
    rating: 4.9,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-10'),
    lessons: [
      {
        id: '2-1',
        title: 'React Hooks Deep Dive',
        description: 'Understanding useState, useEffect, and custom hooks',
        videoUrl: '/demo-content/videos/react-hooks.mp4',
        duration: '75 min',
        order: 1
      },
      {
        id: '2-2',
        title: 'Context API and State Management',
        description: 'Managing global state with Context API',
        videoUrl: '/demo-content/videos/react-context.mp4',
        duration: '85 min',
        order: 2
      },
      {
        id: '2-3',
        title: 'Performance Optimization',
        description: 'Optimizing React applications for better performance',
        videoUrl: '/demo-content/videos/react-performance.mp4',
        duration: '70 min',
        order: 3
      }
    ]
  },
  {
    id: '3',
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning using Python.',
    instructor: 'Dr. Sarah Wilson',
    instructorId: '2',
    thumbnail: '/demo-content/images/course3-thumb.jpg',
    duration: '16 weeks',
    level: 'intermediate',
    price: 249.99,
    category: 'Data Science',
    enrolled: 234,
    rating: 4.7,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-12-05'),
    lessons: [
      {
        id: '3-1',
        title: 'Python for Data Science',
        description: 'Introduction to NumPy and Pandas',
        videoUrl: '/demo-content/videos/python-data.mp4',
        duration: '95 min',
        order: 1
      },
      {
        id: '3-2',
        title: 'Data Visualization',
        description: 'Creating charts and graphs with Matplotlib and Seaborn',
        videoUrl: '/demo-content/videos/data-viz.mp4',
        duration: '80 min',
        order: 2
      },
      {
        id: '3-3',
        title: 'Machine Learning Basics',
        description: 'Introduction to ML algorithms and scikit-learn',
        videoUrl: '/demo-content/videos/ml-basics.mp4',
        duration: '120 min',
        order: 3
      }
    ]
  }
]