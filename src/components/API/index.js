export const fetchDoctorDetailsFromAPI = async (doctorId) => {
    try {
        const response = await fetch(
            'https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/doctor',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doctor_id: doctorId }),
            }
        );
        const data = await response.json();
        return data?.data?.[0];
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        return null;
    }
};