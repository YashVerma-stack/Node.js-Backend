const applications = [];

let nextId = 1;

export const getAllApplications = () => {
    return applications;
};

export const getApplicationById = (id) => {
    return applications.find(
        (application) => application.id === Number(id)
    );
};

export const createApplication = (data) => {
    const application = {
        id: nextId++,
        company: data.company,
        position: data.position,
        status: data.status || "Applied",
        location: data.location || "Not specified",
        appliedDate: data.appliedDate || new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
    };

    applications.push(application);

    return application;
};

export const updateApplication = (id, data) => {
    const application = getApplicationById(id);

    if (!application) {
        return null;
    }

    Object.assign(application, data);

    return application;
};

export const deleteApplication = (id) => {
    const index = applications.findIndex(
        (application) => application.id === Number(id)
    );

    if (index === -1) {
        return false;
    }

    applications.splice(index, 1);

    return true;
}