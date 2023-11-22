import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from '../models/product.model';
import { AddToCart, RemoveFromCart } from './cart.action';
import { Injectable } from '@angular/core';

export interface CartStateModel {
	cartItems: { product: Product; quantity: number }[]; // Utilisez un tableau d'objets avec product et quantity
}

@State<CartStateModel>({
	name: 'cart',
	defaults: {
		cartItems: [],
	},
})

@Injectable()
export class CartState {
	@Selector()
	static cartItems(state: CartStateModel) {
		return state.cartItems;
	}

	@Action(AddToCart)
	addToCart(
		{ getState, patchState }: StateContext<CartStateModel>,
		{ payload }: AddToCart
	) {
		const state = getState();
		const existingCartItem = state.cartItems.find((item) => item.product.id === payload.id);

		if (existingCartItem) {
			// Si le produit existe déjà dans le panier, augmentez la quantité
			existingCartItem.quantity += 1;
		} else {
			// Si le produit n'est pas encore dans le panier, ajoutez-le avec une quantité de 1
			state.cartItems.push({ product: payload, quantity: 1 });
		}

		patchState({
			cartItems: [...state.cartItems],
		});
	}

	@Action(RemoveFromCart)
	removeFromCart(
		{ getState, patchState }: StateContext<CartStateModel>,
		{ productId }: RemoveFromCart
	) {
		const state = getState();
		const existingCartItemIndex = state.cartItems.findIndex((item) => item.product.id === productId);

		if (existingCartItemIndex !== -1) {
			const existingCartItem = state.cartItems[existingCartItemIndex];

			if (existingCartItem.quantity > 1) {
				existingCartItem.quantity -= 1;
			} else {
				state.cartItems.splice(existingCartItemIndex, 1);
			}

			patchState({
				cartItems: [...state.cartItems],
			});
		}
	}
}