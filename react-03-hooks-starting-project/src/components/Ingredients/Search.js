import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
    const { onLoadIngredients } = props;
    const [enteredFilter, setEnteredFilter] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            /*
             * How closures work - enteredFilter var here will not be of the v-
             * alue in the moment it is checked but in the moment the setTimeo-
             * ut() was locked, i.e. old value 500ms ago; we get the current v-
             * alue by using useRef() hook, and that will be yet another useEf-
             * fect() dependency.
             */
            if (enteredFilter === inputRef.current.value) {
                const query =
                    enteredFilter.length == 0
                        ? ""
                        : `?orderBy="title"&equalTo="${enteredFilter}"`;

                fetch(
                    "https://react-03-hooks-start-prj-default-rtdb.firebaseio.com/ingredients.json" +
                        query
                )
                    .then((response) => response.json())
                    .then((responseData) => {
                        const loadedIngredients = [];

                        for (const key in responseData) {
                            loadedIngredients.push({
                                id: key,
                                title: responseData[key].title,
                                amount: responseData[key].amount,
                            });
                        }
                        onLoadIngredients(loadedIngredients);
                    });
            }
        }, 500);
        // cleanup function, run just before its function will run the second time
        return () => {
            clearTimeout(timer);
        };
    }, [enteredFilter, onLoadIngredients, inputRef]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        ref={inputRef}
                        type="text"
                        id="filter"
                        value={enteredFilter}
                        onChange={(event) => {
                            setEnteredFilter(event.target.value);
                        }}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
