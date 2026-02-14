const run = async () => {
    try {
        console.log('Fetching events...');
        const eventsResponse = await fetch('http://localhost:8001/api/events');
        const eventsData = await eventsResponse.json();

        if (eventsData.data.length === 0) {
            console.log('No events found to test tickets for.');
            return;
        }

        const eventId = eventsData.data[0]._id;
        console.log('Testing tickets for event:', eventId);

        const ticketsResponse = await fetch(`http://localhost:8001/api/tickets?eventId=${eventId}`);
        const ticketsData = await ticketsResponse.json();

        console.log('Response Status:', ticketsResponse.status);
        console.log('Tickets Data:', ticketsData);

        if (Array.isArray(ticketsData) && ticketsData.length > 0) {
            console.log('SUCCESS: API returned tickets');
        } else {
            console.log('FAILURE: API returned empty or invalid data');
        }

    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
};

run();
