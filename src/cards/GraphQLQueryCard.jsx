import { List, ListItem, ListItemText, Typography } from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing10, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { withIntl } from '../utils/ReactIntlProviderWrapper';
import { useIntl } from 'react-intl';

const styles = () => ({
    card: {
        marginRight: spacing40,
        marginLeft: spacing40,
        paddingTop: spacing10
    },
    list: {
        paddingBottom: spacing40
    },
    formControl: {
        marginTop: spacing10,
        marginBottom: spacing40
    },
    text: {
        marginRight: spacing40,
        marginLeft: spacing40
    }
});

const cacheKey = 'graphql-card:sites';

/**
 * Demonstrates how to use a GraphQL query to make an Ethos request. Uses the SDK's
 * {code}getEthosQuery{code} function
 *
 * It uses the "list-buildings" query defined in this extension's `extension.js` file.
 *
 * @param {Object.<string, *>} props Component props
 * @returns {React.Component}        The Props card
 */
const GraphQLQueryCard = (props) => {
    const {
        classes,
        cardControl: {
            setLoadingStatus,
            setErrorMessage
        },
        data: { getEthosQuery },
        cache: { getItem, storeItem }
    } = props;
    const intl = useIntl();
    const [sites, setSites] = useState();

    useEffect(() => {
        (async () => {
            setLoadingStatus(true);

            const { data: cachedData, expired: cachedDataExpired = true } = await getItem({ key: cacheKey });
            if (cachedData) {
                setLoadingStatus(false);
                setSites(() => cachedData);
            }
            if (cachedDataExpired || cachedData === undefined) {
                try {
                    const sitesData = await getEthosQuery({ queryId: 'list-sites' });
                    const { data: { sites: { edges: siteEdges } = [] } = {} } = sitesData;
                    const sites = siteEdges.map(edge => edge.node);
                    setSites(() => sites);
                    storeItem({ key: cacheKey, data: sites });
                    setLoadingStatus(false);
                } catch (error) {
                    console.error('ethosQuery failed', error);
                    setErrorMessage({
                        headerMessage: intl.formatMessage({ id: 'GraphQLQueryCard-fetchFailed' }),
                        textMessage: intl.formatMessage({ id: 'GraphQLQueryCard-sitesFetchFailed' }),
                        iconName: 'error',
                        iconColor: '#D42828'
                    });
                }
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Renders a list of available sites.
     *
     * Displays site names in a read-only list using the sites data model through a GraphQL query.
     */

    return (
        <Fragment>
            {sites && (
                <div className={classes.card}>
                    {Array.isArray(sites) && sites.length > 0 ? (
                        <List className={classes.list} aria-label={intl.formatMessage({ id: 'GraphQLQueryCard-sites', defaultMessage: 'List of sites' })}>
                            {sites.map((site) => (
                                <ListItem key={site.id} disablePadding>
                                    <ListItemText primary={site.title} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography className={classes.text} variant="body2" color="textSecondary">
                            {intl.formatMessage({ id: 'GraphQLQueryCard-sitesFetchFailed', defaultMessage: 'No sites available.' })}
                        </Typography>
                    )}
                </div>
            )}
        </Fragment>
    );
};

GraphQLQueryCard.propTypes = {
    cardControl: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    cache: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    mockSites: PropTypes.object,
    mockBuildings: PropTypes.object
};
export default withIntl(withStyles(styles)(GraphQLQueryCard));
