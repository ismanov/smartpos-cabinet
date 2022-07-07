export default (theme) => ({
    main: {
        minHeight: '100%',
        overflowY: 'auto'
    },
    content: {
        flex: 1
    },
    info: {
        height: '100%'
    },
    typedContainer: {
        minHeight: 120,
        [theme.breakpoints.down('sm')]: {
            marginTop: 30,
            padding: '10px 40px 10px 40px'

        },
        [theme.breakpoints.up('md')]: {
            marginTop: 50,
            padding: '10px 90px 10px 90px'
        },
        [theme.breakpoints.up('lg')]: {
            marginTop: 90,
            padding: '10px 120px 10px 120px'
        }
    },

    infoContainer: {
        [theme.breakpoints.down('sm')]: {
            padding: '10px 40px 10px 40px'
        },
        [theme.breakpoints.up('md')]: {
            padding: '10px 90px 10px 90px'
        },
        [theme.breakpoints.up('lg')]: {
            padding: '10px 120px 10px 120px'
        },
        marginTop: 40
    },


    typedTitle: {
        fontFamily: 'Roboto, sans-serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        [theme.breakpoints.down('sm')]: {
            fontSize: 24,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 30,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: 36,
        },
        color: theme.palette.primary.main
    },
    typed: {
        fontFamily: 'Roboto, sans-serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        [theme.breakpoints.down('sm')]: {
            fontSize: 24,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 30,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: 36,
        },
        color: '#5C5C5C'
    },
    iconDescContainer: {
        display: 'flex',
        flexFlow: 'row',
        marginTop: 20,
        '&:nth-child(even)': {
            [theme.breakpoints.up('md')]: {
                paddingLeft: 20
            }
        },
        zIndex: 1
    },
    iconDescIcon: {
        width: 65,
        height: 65
    },
    iconDescText: {
        fontSize: 16,
        paddingLeft: 20,
        fontStyle: 'italic',
        fontFamily: 'Roboto, sans-serif',
        color: '#88A0A9'
    },
    pContainer: {
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            padding: 20
        },
        [theme.breakpoints.up('md')]: {
            padding: 60,
        },
        [theme.breakpoints.up('lg')]: {
            padding: 90,
        },
    },
    paper: {
        width: '100%',
        height: '53vh',
        display: 'block',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 1
    },
    particle_bg: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 0
    },
    content_title: {
        fontFamily: 'Roboto, sans-serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 36,
        color: theme.palette.primary.main
    }
})
