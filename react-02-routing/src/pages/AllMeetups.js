import { useEffect, useState } from "react";

import MeetupList from "../components/meetups/MeetupList";

function AllMeetupsPage() {
    // useState() always returns two values: a current state snapshot and a function for changing that state
    const [isLoading, setIsLoading] = useState(true);
    const [loadedMeetups, setLoadedMeetups] = useState([]);

    // first arg is a function, second argument is an array of dependencies (pt478)
    useEffect(() => {
        fetch(
            "https://react-02-routing-default-rtdb.firebaseio.com/meetups.json"
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const meetups = [];

                for (const key in data) {
                    const meetup = {
                        id: key,
                        ...data[key],
                    };
                    meetups.push(meetup);
                }

                setIsLoading(false);
                setLoadedMeetups(meetups);
            });
    }, []);

    if (isLoading) {
        return (
            <section>
                <p>Loading...</p>
            </section>
        );
    }

    return (
        <section>
            <h1>All Meetups</h1>
            <MeetupList meetups={loadedMeetups} />
        </section>
    );
}

export default AllMeetupsPage;
