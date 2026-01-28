module.exports = {
    name: 'GraphQL Sites Test',
    publisher: 'Name of developer here',
    cards: [{
        type: 'GraphQLQueryCard',
        source: './src/cards/GraphQLQueryCard',
        miniCardIcon: 'building',
        category: 'work',
        title: 'List of Sites',
        displayCardType: 'GraphQL Query',
        description: 'GraphQL Query',
        queries: {
            'list-sites': [
                {
                    resourceVersions: {
                        sites: { min: 6 },
                    },
                    query:
                        `{
                            sites: {sites} (
                                sort: { title: ASC }
                            )
                            {
                                edges {
                                    node {
                                        id
                                        title
                                    }
                                }
                            }
                        }`
                }
            ]
        }
    }],
    page: {
        source: './src/page/router.jsx'
    }
};