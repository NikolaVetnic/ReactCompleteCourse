import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
    // action is an object that could have type which can determine different types of actions
    switch (action.type) {
        case "SET":
            return action.ingredients;
        case "ADD":
            return [...currentIngredients, action.ingredient];
        case "DELETE":
            return currentIngredients.filter((ig) => ig.id !== action.id);
        default:
            throw new Error("Should not get there...");
    }
};

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
        case "SEND":
            return { loading: true, error: null };
        case "RESPONSE":
            return { ...currHttpState, loading: false };
        case "ERROR":
            return { loading: false, error: action.errorMessage };
        case "CLEAR":
            return { ...currHttpState, error: null };
        default:
            throw new Error("Should not get there...");
    }
};

function Ingredients() {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false,
        error: null,
    });

    useEffect(() => {
        console.log("Rendering ingredients...", userIngredients);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback((filteredIngredients) => {
        dispatch({ type: "SET", ingredients: filteredIngredients });
    }, []);

    const addIngredientHandler = useCallback((ingredient) => {
        dispatchHttp({ type: "SEND" });

        if (ingredient.name !== "" && ingredient.amount !== "") {
            // Firebase URL has to end with .json
            fetch(
                "https://react-03-hooks-start-prj-default-rtdb.firebaseio.com/ingredients.json",
                {
                    method: "POST",
                    body: JSON.stringify(ingredient),
                    headers: { "Content-Type": "application/json" },
                }
            )
                .then((response) => {
                    dispatchHttp({ type: "RESPONSE" });
                    return response.json();
                })
                .then((responseData) => {
                    dispatch({
                        type: "ADD",
                        ingredient: { id: responseData.name, ...ingredient },
                    });
                });
        }
    }, []);

    const removeIngredientHandler = useCallback((ingredientId) => {
        dispatchHttp({ type: "SEND" });

        fetch(
            `https://react-03-hooks-start-prj-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
            {
                method: "DELETE",
            }
        )
            .then((response) => {
                dispatchHttp({ type: "RESPONSE" });
                dispatch({ type: "DELETE", id: ingredientId });
            })
            .catch((error) => {
                dispatchHttp({
                    type: "ERROR",
                    errorMessage: "Something went wrong...",
                });
            });
    }, []);

    const clearError = useCallback(() => {
        dispatchHttp({ type: "CLEAR" });
    }, []);

    const ingredientList = useMemo(() => {
        return (
            <IngredientList
                ingredients={userIngredients}
                onRemoveItem={removeIngredientHandler}
            />
        );
    }, [userIngredients]);

    return (
        <div className="App">
            {httpState.error && (
                <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
            )}

            <IngredientForm
                onAddIngredient={addIngredientHandler}
                loading={httpState.loading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler} />
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
