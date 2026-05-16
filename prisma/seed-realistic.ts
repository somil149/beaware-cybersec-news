import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting realistic data seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'security' },
      update: {},
      create: {
        name: 'Security',
        slug: 'security',
        description: 'Cybersecurity news and updates',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'privacy' },
      update: {},
      create: {
        name: 'Privacy',
        slug: 'privacy',
        description: 'Data privacy and protection news',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'threats' },
      update: {},
      create: {
        name: 'Threats',
        slug: 'threats',
        description: 'Latest security threats and vulnerabilities',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'compliance' },
      update: {},
      create: {
        name: 'Compliance',
        slug: 'compliance',
        description: 'Regulatory compliance news',
      },
    }),
  ])

  console.log('Categories created:', categories.length)

  // Create sources
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { name: 'Krebs on Security' },
      update: {},
      create: {
        name: 'Krebs on Security',
        url: 'https://krebsonsecurity.com',
        type: 'RSS',
      },
    }),
    prisma.source.upsert({
      where: { name: 'Threat Post' },
      update: {},
      create: {
        name: 'Threat Post',
        url: 'https://threatpost.com',
        type: 'RSS',
      },
    }),
    prisma.source.upsert({
      where: { name: 'Ars Technica Security' },
      update: {},
      create: {
        name: 'Ars Technica Security',
        url: 'https://arstechnica.com/security',
        type: 'RSS',
      },
    }),
  ])

  console.log('Sources created:', sources.length)

  // Create realistic articles
  const articles = await Promise.all([
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article1' },
      update: {},
      create: {
        id: 'art-1',
        title: 'Critical Vulnerability Discovered in Popular Software Supply Chain',
        summary: 'Security researchers have identified a critical vulnerability affecting multiple software supply chains, potentially impacting millions of users worldwide.',
        content: 'Security researchers have identified a critical vulnerability affecting multiple software supply chains. The vulnerability, tracked as CVE-2024-XXXX, could allow attackers to execute arbitrary code or steal sensitive data. Users are strongly advised to update their software immediately. The vulnerability affects various components used in popular development tools and applications. Security teams are working on patches and will release updates as soon as possible. In the meantime, users should monitor for any suspicious activity.',
        url: 'https://beaware.cybersectoday.org/article1',
        publishedAt: new Date(Date.now() - 3600000), // 1 hour ago
        author: 'Security Research Team',
        imageUrl: null,
        tags: ['vulnerability', 'supply-chain', 'security'],
        categoryId: categories[0].id,
        sourceId: sources[0].id,
      },
    }),
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article2' },
      update: {},
      create: {
        id: 'art-2',
        title: 'New GDPR Compliance Requirements for Cloud Service Providers',
        summary: 'European regulators have announced updated compliance requirements for cloud service providers operating within the EU, emphasizing data sovereignty and user privacy.',
        content: 'European regulators have announced updated compliance requirements for cloud service providers operating within the EU. The new requirements emphasize data sovereignty and user privacy, mandating stricter controls on data storage and processing. CSPs will need to implement enhanced encryption standards and provide detailed transparency reports about data handling practices. The changes come as part of the broader Digital Services Act (DSA) and are expected to take effect in the coming months. Companies operating in the EU should begin preparing for these changes immediately.',
        url: 'https://beaware.cybersectoday.org/article2',
        publishedAt: new Date(Date.now() - 7200000), // 2 hours ago
        author: 'Legal Correspondent',
        imageUrl: null,
        tags: ['gdpr', 'compliance', 'cloud', 'privacy'],
        categoryId: categories[3].id,
        sourceId: sources[1].id,
      },
    }),
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article3' },
      update: {},
      create: {
        id: 'art-3',
        title: 'Major Banking Institution Reports Data Breach Affecting 50,000 Customers',
        summary: 'A leading financial institution has disclosed a data breach that may have exposed personal and financial information of approximately 50,000 customers.',
        content: 'A leading financial institution has disclosed a data breach that may have exposed personal and financial information of approximately 50,000 customers. The breach, discovered during routine security monitoring, is believed to have occurred over a period of several weeks. The bank has notified affected customers and is offering free credit monitoring services. An investigation is underway to determine the exact scope of the breach and identify those responsible. Customers are advised to monitor their accounts for suspicious activity and change their passwords as a precaution.',
        url: 'https://beaware.cybersectoday.org/article3',
        publishedAt: new Date(Date.now() - 14400000), // 4 hours ago
        author: 'Banking Security Team',
        imageUrl: null,
        tags: ['data-breach', 'banking', 'security', 'financial'],
        categoryId: categories[0].id,
        sourceId: sources[2].id,
      },
    }),
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article4' },
      update: {},
      create: {
        id: 'art-4',
        title: 'AI-Powered Phishing Attacks Becoming More Sophisticated',
        summary: 'Security experts warn about a new wave of AI-powered phishing attacks that can bypass traditional email security filters.',
        content: 'Security experts warn about a new wave of AI-powered phishing attacks that can bypass traditional email security filters. These attacks use machine learning to create highly convincing emails that mimic legitimate communications from known contacts. The AI can analyze writing patterns and context to create messages that appear authentic. Organizations are advised to implement additional security layers, including multi-factor authentication and user awareness training. Security vendors are developing new detection methods specifically designed to identify AI-generated content.',
        url: 'https://beaware.cybersectoday.org/article4',
        publishedAt: new Date(Date.now() - 28800000), // 8 hours ago
        author: 'Cybersecurity Analyst',
        imageUrl: null,
        tags: ['phishing', 'ai', 'machine-learning', 'email-security'],
        categoryId: categories[2].id,
        sourceId: sources[0].id,
      },
    }),
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article5' },
      update: {},
      create: {
        id: 'art-5',
        title: 'Ransomware Gang Targets Healthcare Organizations',
        summary: 'A notorious ransomware group has been actively targeting healthcare organizations, demanding millions in ransom payments for encrypted data.',
        content: 'A notorious ransomware group has been actively targeting healthcare organizations, demanding millions in ransom payments for encrypted data. The group has successfully compromised several hospital systems, disrupting patient care and forcing some facilities to divert emergency cases. Healthcare organizations are particularly vulnerable due to the critical nature of their services and the pressure to quickly restore operations. The FBI and CISA have issued advisories warning healthcare providers to strengthen their cybersecurity posture and ensure robust backup systems are in place.',
        url: 'https://beaware.cybersectoday.org/article5',
        publishedAt: new Date(Date.now() - 43200000), // 12 hours ago
        author: 'Health Security Reporter',
        imageUrl: null,
        tags: ['ransomware', 'healthcare', 'cybercrime', 'critical-infrastructure'],
        categoryId: categories[2].id,
        sourceId: sources[1].id,
      },
    }),
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article6' },
      update: {},
      create: {
        id: 'art-6',
        title: 'Zero Trust Architecture Gains Traction in Enterprise Security',
        summary: 'More enterprises are adopting zero trust architecture as a foundational security model to protect against modern threats.',
        content: 'More enterprises are adopting zero trust architecture as a foundational security model to protect against modern threats. This approach assumes no user or device should be trusted by default, requiring continuous verification of identity and device health. Companies report improved security posture and reduced attack surfaces after implementing zero trust principles. Key components include multi-factor authentication, micro-segmentation, and continuous monitoring. While implementation can be complex, the security benefits are proving significant for organizations with distributed environments.',
        url: 'https://beaware.cybersectoday.org/article6',
        publishedAt: new Date(Date.now() - 86400000), // 24 hours ago
        author: 'Enterprise Security Expert',
        imageUrl: null,
        tags: ['zero-trust', 'enterprise', 'architecture', 'security-model'],
        categoryId: categories[0].id,
        sourceId: sources[2].id,
      },
    }),
    prisma.article.upsert({
      where: { url: 'https://beaware.cybersectoday.org/article7' },
      update: {},
      create: {
        id: 'art-7',
        title: 'IoT Device Security Concerns in Smart Home Networks',
        summary: 'Researchers discover vulnerabilities in popular smart home devices that could allow attackers access to home networks and connected devices.',
        content: 'Researchers discover vulnerabilities in popular smart home devices that could allow attackers access to home networks and connected devices. The vulnerabilities range from weak authentication mechanisms to insecure data transmission protocols. Affected devices include smart thermostats, security cameras, and voice assistants. Manufacturers are releasing firmware updates to address the issues, but many users may not apply these updates automatically. Security experts recommend changing default passwords, keeping firmware updated, and segmenting IoT devices on separate networks.',
        url: 'https://beaware.cybersectoday.org/article7',
        publishedAt: new Date(Date.now() - 172800000), // 48 hours ago
        author: 'IoT Security Researcher',
        imageUrl: null,
        tags: ['iot', 'smart-home', 'vulnerabilities', 'network-security'],
        categoryId: categories[2].id,
        sourceId: sources[0].id,
      },
    }),
  ])

  console.log(`Created ${articles.length} realistic articles`)

  console.log('Realistic data seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding realistic data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })