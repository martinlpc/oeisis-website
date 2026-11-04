import { getYouTubeId } from '../../utils/youtube'

// Estados iniciales y helpers compartidos por los formularios del admin

export const EMPTY_SHOW = {
    title: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    city: '',
    province: 'Buenos Aires',
    country: 'Argentina',
    ticketLink: '',
    freeEntry: false,
    description: '',
}

export const EMPTY_VIDEO = { title: '', embedUrl: '', description: '', date: '', featured: false }

export const EMPTY_PHOTO = { title: '', imageUrl: '', date: '', album: '' }

export const EMPTY_NEWS = { type: 'news', title: '', content: '', externalLink: '', featured: false }

// Handler común: maneja inputs de texto y checkboxes
export const fieldChange = (setState) => (e) => {
    const { name, value, type, checked } = e.target
    setState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
}

export const isValidYouTube = (url) => Boolean(getYouTubeId(url))
