import {
    AUTH_PREFIX_PATH,
    DASHBOARDS_PREFIX_PATH,
    CONCEPTS_PREFIX_PATH,
} from '@/constants/route.constant'

export const notificationListData = [
    {
        id: 'e55adc24-1803-4ffd-b653-09be273f8df5',
        target: 'Jeremiah Minsk',
        description: 'mentioned your in comment.',
        date: '2 minutes ago',
        image: 'thumb-2.jpg',
        type: 0,
        location: '',
        locationLabel: '',
        status: '',
        readed: true,
    },
    {
        id: 'b06ca3f5-8fb0-4979-a016-30dfe63e8fd6',
        target: 'Max Alexander',
        description: 'invited you to new project.',
        date: '10 minutes ago',
        image: 'thumb-3.jpg',
        type: 0,
        location: '',
        locationLabel: '',
        status: '',
        readed: false,
    },
    {
        id: 'f644235d-dffc-4f17-883f-1ada117ff2c9',
        target: '',
        description: 'Please submit your daily report.',
        date: '3 hours ago',
        image: '',
        type: 1,
        location: '',
        locationLabel: '',
        status: '',
        readed: false,
    },
    {
        id: '2152cd09-413a-44be-9d5a-b2b820c6a661',
        target: 'Shannon Baker',
        description: 'comment in your ticket.',
        date: '4 hours ago',
        image: 'thumb-4.jpg',
        type: 0,
        location: '',
        locationLabel: '',
        status: '',
        readed: false,
    },
    {
        id: '8ca04d2c-0262-417b-8a3d-4ade49939059',
        target: '',
        description: 'Your request was rejected',
        date: '2 days ago',
        image: '',
        type: 2,
        location: '',
        locationLabel: '',
        status: 'failed',
        readed: true,
    },

    {
        id: '8dd23dfd-a79b-40ad-b4e9-7e70a148d5b6',
        target: '',
        description: 'Your request has been approved.',
        date: '4 minutes ago',
        image: '4 days ago',
        type: 2,
        location: '',
        locationLabel: '',
        status: 'succeed',
        readed: true,
    },
]

export const searchQueryPoolData = [
    
   
    {
        key: 'dashboard.analytic',
        path: `${DASHBOARDS_PREFIX_PATH}/analytic`,
        title: 'Analytic',
        icon: 'dashboardAnalytic',
        category: 'Dashboard',
        categoryTitle: 'Dashboard',
    },
    {
        key: 'authentication.signInSimple',
        path: `${AUTH_PREFIX_PATH}/sign-in-simple`,
        title: 'Sign In Simple',
        icon: 'signIn',
        category: 'Authentication',
        categoryTitle: 'Auth',
    },
    {
        key: 'authentication.signInSide',
        path: `${AUTH_PREFIX_PATH}/sign-in-side`,
        title: 'Sign In Side',
        icon: 'signIn',
        category: 'Authentication',
        categoryTitle: 'Auth',
    },
    {
        key: 'authentication.signInSplit',
        path: `${AUTH_PREFIX_PATH}/sign-in-split`,
        title: 'Sign In Split',
        icon: 'signIn',
        category: 'Authentication',
        categoryTitle: 'Auth',
    },
   
    {
        key: 'authentication.forgotPasswordSimple',
        path: `${AUTH_PREFIX_PATH}/forgot-password-simple`,
        title: 'Forget PasswordSimple',
        icon: 'forgotPassword',
        category: 'Authentication',
        categoryTitle: 'Auth',
    },
   
    {
        key: 'authentication.forgotPasswordSplit',
        path: `${AUTH_PREFIX_PATH}/forgot-password-split`,
        title: 'Forget Password Split',
        icon: 'forgotPassword',
        category: 'Authentication',
        categoryTitle: 'Auth',
    },
  
    
   
    {
        key: 'concepts.customers.customerList',
        path: `${CONCEPTS_PREFIX_PATH}/customers/customer-list`,
        title: 'Customer List',
        icon: 'customerList',
        category: 'Customers',
        categoryTitle: 'Concepts',
    },
    {
        key: 'concepts.customers.customerEdit',
        path: `${CONCEPTS_PREFIX_PATH}/customers/customer-edit/1`,
        title: 'Customer Edit',
        icon: 'customerEdit',
        category: 'Customers',
        categoryTitle: 'Concepts',
    },
    {
        key: 'concepts.customers.customerCreate',
        path: `${CONCEPTS_PREFIX_PATH}/customers/customer-create`,
        title: 'Customer Create',
        icon: 'customerCreate',
        category: 'Customers',
        categoryTitle: 'Concepts',
    },
    {
        key: 'concepts.customers.customerDetails',
        path: `${CONCEPTS_PREFIX_PATH}/customers/customer-details/1`,
        title: 'Customer Details',
        icon: 'customerDetails',
        category: 'Customers',
        categoryTitle: 'Concepts',
    },
   
    {
        key: 'concepts.account.settings',
        path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
        title: 'Settings',
        icon: 'accountSettings',
        category: 'Account',
        categoryTitle: 'Concepts',
    },
    {
        key: 'concepts.account.activityLog',
        path: `${CONCEPTS_PREFIX_PATH}/account/activity-log`,
        title: 'Activity log',
        icon: 'accountActivityLogs',
        category: 'Account',
        categoryTitle: 'Concepts',
    },
    {
        key: 'concepts.account.rolesPermissions',
        path: `${CONCEPTS_PREFIX_PATH}/account/roles-permissions`,
        title: 'Roles & Permissions',
        icon: 'accountRoleAndPermission',
        category: 'Account',
        categoryTitle: 'Concepts',
    },
    {
        key: 'concepts.account.pricing',
        path: `${CONCEPTS_PREFIX_PATH}/account/pricing`,
        title: 'Pricing',
        icon: 'accountPricing',
        category: 'Account',
        categoryTitle: 'Concepts',
    },
    
    {
        key: 'concepts.fileManager',
        path: `${CONCEPTS_PREFIX_PATH}/file-manager`,
        title: 'File Manager',
        icon: 'fileManager',
        category: 'Others',
        categoryTitle: 'Concepts',
    },
    
   
   
]
