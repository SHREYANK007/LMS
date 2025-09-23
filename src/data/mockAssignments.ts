import { Assignment, Submission } from '@/types'

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentId: '4',
    assignmentId: '1',
    content: 'I have completed the HTML structure for the personal portfolio website. The website includes a header with navigation, about section, projects section, and contact form.',
    attachments: ['/demo-content/documents/emily-portfolio.zip'],
    grade: 85,
    feedback: 'Great work on the HTML structure! Consider adding semantic HTML5 elements for better accessibility.',
    submittedAt: new Date('2024-03-25'),
    gradedAt: new Date('2024-03-27')
  },
  {
    id: '2',
    studentId: '5',
    assignmentId: '1',
    content: 'My portfolio website is complete with responsive design and interactive elements. I used CSS Grid and Flexbox for layout.',
    attachments: ['/demo-content/documents/david-portfolio.zip'],
    grade: 92,
    feedback: 'Excellent use of modern CSS techniques! Your responsive design works perfectly across devices.',
    submittedAt: new Date('2024-03-26'),
    gradedAt: new Date('2024-03-28')
  }
]

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Build a Personal Portfolio Website',
    description: 'Create a responsive personal portfolio website using HTML, CSS, and JavaScript. Include sections for about, projects, and contact information.',
    courseId: '1',
    dueDate: new Date('2024-04-01'),
    points: 100,
    submissions: mockSubmissions.filter(s => s.assignmentId === '1'),
    createdAt: new Date('2024-03-20')
  },
  {
    id: '2',
    title: 'React Todo Application',
    description: 'Build a full-featured todo application using React hooks. Include features like add, edit, delete, and mark as complete.',
    courseId: '2',
    dueDate: new Date('2024-05-15'),
    points: 150,
    submissions: [],
    createdAt: new Date('2024-05-01')
  },
  {
    id: '3',
    title: 'Data Analysis Project',
    description: 'Analyze a dataset of your choice using Python and create visualizations to present your findings.',
    courseId: '3',
    dueDate: new Date('2024-06-01'),
    points: 200,
    submissions: [],
    createdAt: new Date('2024-05-10')
  }
]