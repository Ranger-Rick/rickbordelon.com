import FullscreenSection from '../components/FullscreenSection.vue'
import ImageSection from '../components/ImageSection.vue'
import RangerSection from '../components/RangerSection.vue'
import ToolsSection from '../components/ToolsSection.vue'
import rangerImage from '../assets/images/ranger.webp'
import educationImage from '../assets/images/education.webp'
import type { Section } from '../types/section'

export const sections: Section[] = [
  {
    id: 'about-me',
    component: FullscreenSection,
    title: 'About Me',
    align: 'center',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Ranger-Rick'
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/rick-bordelon'
      },
      {
        label: 'Resume',
        href: '/resume.pdf'
      }
    ],
    body: [
      'Senior software developer with 9+ years of experience building cross platform mobile applications and web APIs in the .NET ecosystem.',
      'Delivered mobile solutions serving nearly 8,000 pharmaccies nationwide. Proven ability to lead distributed teams, architect scalable services and ship solutions that directly impact the bottom line for customers.',
    ],
  },
  {
    id: 'Education',
    component: ImageSection,
    title: 'Education',
    align: 'left',
    body: [
      'Louisiana Tech University | March 2020',
      'Bachelors of Science | Computer Information Systems',
      '',
      'GPA: 3.76',
    ],
    image: educationImage,
    imageAlt: 'Rick standing by the Louisiana Tech bulldog at his graduation',
  },
  {
    id: 'Impact',
    component: FullscreenSection,
    title: 'Impact',
    align: 'right',
    body: [
      'Implemented a centralized payment processing solution that reduces credit card fees, saving an estimated average of $4k (and in some cases, up to $25k) annually.',
      'Containerized existing applications, reducing QA deployment time by ~75%.',
      'Mentored coding bootcamp participants in full stack development fundamentals.',
    ],
  },
  {
    id: 'tools',
    component: ToolsSection,
  },
  {
    id: 'ranger-image',
    component: ImageSection,
    title: 'Ranger',
    align: 'right',
    body: [
      'This is my cat. He is very mischevious.',
      'He also happens to be the brains of this operation...',
    ],
    image: rangerImage,
    imageAlt: 'A black cat perched on a wall shelf',
  },
  {
    id: 'my-life',
    component: FullscreenSection,
    title: 'My Life',
    align: 'center',
    body: [
      'Based in north Louisiana with my partner, cat, and dog, I love to read and play rougelike video games.',
      'I brew my own beer and make my own pickles! Let\'s share a snack sometime!',
    ],
  },
  {
    id: 'ranger',
    component: RangerSection,
  },
]
