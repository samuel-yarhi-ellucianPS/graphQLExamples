module.exports = {
    name: 'GraphQLTest',
    publisher: 'Sample',
    cards: [{
        type: 'GraphQLQueryCard',
        source: './src/cards/GraphQLQueryCard',
        miniCardIcon: 'building',
        category: 'work',
        title: 'Buildings Test',
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
            ],
            'list-buildings': [
                {
                    resourceVersions: {
                        buildings: { min: 6 },
                        sites: { min: 6 },
                    },
                    query:
                        `query listBuildings($siteId: ID){
                            buildings : {buildings}(
                                filter: {
                                    {site}: {
                                        id: { EQ: $siteId }
                                    }
                                },
                                sort: { title: ASC }
                            )
                            {
                                edges {
                                    node {
                                        id
                                        title
                                        site  : {site} {
                                            id
                                        }
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