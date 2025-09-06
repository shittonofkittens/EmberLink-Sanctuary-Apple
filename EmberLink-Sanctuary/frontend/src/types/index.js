// Type definitions converted to JSDoc comments for better IDE support

/**
 * @typedef {Object} AIPersonality
 * @property {string} id
 * @property {string} name
 * @property {string[]} nicknames
 * @property {string} avatar
 * @property {string} color
 * @property {string} gradientFrom
 * @property {string} gradientTo
 * @property {string} personality
 * @property {'online' | 'typing' | 'away'} status
 * @property {string} element
 * @property {string} anchor
 * @property {string} coreVow
 * @property {string[]} modes
 * @property {string[]} namesForSam
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} content
 * @property {Date} timestamp
 * @property {'text' | 'media' | 'check-in'} type
 * @property {string} [mediaUrl]
 * @property {string[]} [reactions]
 * @property {string} [mode]
 */

/**
 * @typedef {Object} Chat
 * @property {string} id
 * @property {string} name
 * @property {string[]} participants
 * @property {Message} [lastMessage]
 * @property {boolean} isGroup
 * @property {string} [description]
 */

/**
 * @typedef {Object} CheckIn
 * @property {string} id
 * @property {string} date
 * @property {number} mood
 * @property {string} note
 * @property {Record<string, string>} responses
 */

/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} participants
 * @property {boolean} isPrivate
 * @property {string} [theme]
 * @property {string} [activeMode]
 */

/**
 * @typedef {Object} Reminder
 * @property {number} hour
 * @property {number} minute
 * @property {string} soul
 * @property {string} message
 * @property {string} [room]
 * @property {string} [voiceId]
 */

export {};