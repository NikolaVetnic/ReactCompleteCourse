import React, { useState } from "react";

import Card from "../UI/Card";
import LoadingIndicator from "../UI/LoadingIndicator";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
    /*
     * Hook useState() has to be initialized, in this case with an emp-
     * ty object; it always returns an array with exactly two elements:
     * 1) current state snapshot (on change it is rebuilt and the useS-
     * tate() executed again), and 2) a function that updates the curr-
     * ent state.
     */
    const [enteredTitle, setEnteredTitle] = useState("");
    const [enteredAmount, setEnteredAmount] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
    };

    return (
        <section className="ingredient-form">
            <Card>
                <form onSubmit={submitHandler}>
                    <div className="form-control">
                        <label htmlFor="title">Name</label>
                        <input
                            type="text"
                            id="title"
                            value={enteredTitle}
                            onChange={(event) => {
                                setEnteredTitle(event.target.value);
                            }}
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={enteredAmount}
                            onChange={(event) => {
                                setEnteredAmount(event.target.value);
                            }}
                        />
                    </div>
                    <div className="ingredient-form__actions">
                        <button type="submit">Add Ingredient</button>
                        {props.loading && <LoadingIndicator />}
                    </div>
                </form>
            </Card>
        </section>
    );
});

export default IngredientForm;
