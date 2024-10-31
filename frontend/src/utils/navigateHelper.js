let navigate = null;

export const setNavigate = (navFunc) => {
    navigate = navFunc;
};

export const getNavigate = () => navigate;