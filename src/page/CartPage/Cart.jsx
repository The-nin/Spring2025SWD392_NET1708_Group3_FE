// import React from 'react'
import { useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);
  return (
    <>
      {/* Cart Header */}
      <div className="flex justify-center items-center flex-col mt-10">
        <h1 className="text-3xl">Cart</h1>
        <h5>
          Purchase one more item of the sale products and receive <br />
          free shipping! *Automatically applied on the next page
        </h5>
      </div>

      {cart && cart.length === 0 ? (
        <div className="flex justify-center items-center flex-col mt-50">
          You don&apos;t have any items in your cart
        </div>
      ) : (
        <div className="container mx-auto p-5">
          {/* Cart Table */}
          <table className="w-full border-collapse">
            {/* Cart Header */}
            <thead className="border-b-2">
              <tr>
                <th className="text-left text-lg pb-2">CART</th>
                <th className="text-left text-lg pb-2">PRICE</th>
                <th className="text-left text-lg pb-2 w-[10rem]">QUANTITY</th>
                <th className="text-left text-lg pb-2">SUB-TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {/* Cart Item 1 */}
              <tr className="border-b">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/hand-balm.jpg"
                      alt="Hand Balm"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h4 className="text-sm font-semibold">
                        Reverence Aromatique Hand Balm
                      </h4>
                      <p className="text-sm text-gray-500">75 ml</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm font-medium">$25</td>
                <td>
                  <select className="border p-1">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </td>
                <td className="text-sm font-medium">$25</td>
              </tr>

              {/* Cart Item 2 */}
              <tr className="border-b">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/skin-care-kit.jpg"
                      alt="Skin Care Kit"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h4 className="text-sm font-semibold">
                        Classic Skin Care Kit
                      </h4>
                      <p className="text-sm text-gray-500">300 ml</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm font-medium">$85</td>
                <td className="p-2 w-[10rem]">
                  <select className="border p-1 w-[6rem]">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </td>
                <td className="text-sm font-medium">$85</td>
              </tr>
            </tbody>
          </table>

          {/* Total Section */}
          <div className="flex justify-end mt-5 space-x-[16rem] items-center">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-2xl font-semibold ">$110</div>
          </div>
          <p className="text-right text-sm text-gray-500">
            Shipping Fee will be calculated at the time of purchase
          </p>

          {/* Checkout Button */}
          <div className="flex justify-end mt-3">
            <button className="bg-black text-white py-2 w-[21rem]">
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Test */}
      <div className="container mx-auto p-5">
        {/* Cart Table */}
        <table className="w-full border-collapse">
          {/* Cart Header */}
          <thead className="border-b-2">
            <tr>
              <th className="text-left text-lg pb-2">CART</th>
              <th className="text-left text-lg pb-2">PRICE</th>
              <th className="text-left text-lg pb-2 w-[10rem]">QUANTITY</th>
              <th className="text-left text-lg pb-2">SUB-TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {/* Cart Item 1 */}
            <tr className="border-b">
              <td className="py-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/hand-balm.jpg"
                    alt="Hand Balm"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">
                      Reverence Aromatique Hand Balm
                    </h4>
                    <p className="text-sm text-gray-500">75 ml</p>
                  </div>
                </div>
              </td>
              <td className="text-sm font-medium">$25</td>
              <td>
                <select className="border p-1">
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </td>
              <td className="text-sm font-medium">$25</td>
            </tr>

            {/* Cart Item 2 */}
            <tr className="border-b">
              <td className="py-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/skin-care-kit.jpg"
                    alt="Skin Care Kit"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">
                      Classic Skin Care Kit
                    </h4>
                    <p className="text-sm text-gray-500">300 ml</p>
                  </div>
                </div>
              </td>
              <td className="text-sm font-medium">$85</td>
              <td className="p-2 w-[10rem]">
                <select className="border p-1 w-[6rem]">
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </td>
              <td className="text-sm font-medium">$85</td>
            </tr>
          </tbody>
        </table>

        {/* Total Section */}
        <div className="flex justify-end mt-5 space-x-[16rem] items-center">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-2xl font-semibold ">$110</div>
        </div>
        <p className="text-right text-sm text-gray-500">
          Shipping Fee will be calculated at the time of purchase
        </p>

        {/* Checkout Button */}
        <div className="flex justify-end mt-3">
          <button className="bg-black text-white py-2 w-[21rem]">
            Checkout
          </button>
        </div>
      </div>

      {/* end Test */}
    </>
  );
}

export default Cart;
