import Id from "../../../@shared/domain/value-object/id.value-object";
import { OutputFindStoreCatalogFacadeDTO } from "../../../store-catalog/facade/store-catalog-facade.interface";
import Product from "../../domain/product.entity";
import { InputPlaceOrderDTO } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe('PlaceOrderUseCase tests', () => {
    const mockClientFacade = {
        find: jest.fn(),
        add: jest.fn(),
    };

    const mockProductFacade = {
        addProduct: jest.fn(),
        checkStock: jest.fn(),
    };

    const mockCatalogFacade = {
        find: jest.fn(),
        findAll: jest.fn(),
    };

    const mockPaymentFacade = {
        process: jest.fn()
    };

    const mockInvoiceFacade = {
        generate: jest.fn(),
    };

    const mockCheckoutRepository = {
        addOrder: jest.fn().mockImplementation(e => e),
        findOrder: jest.fn(),
    }

    const getPlaceOrderUseCase = () => 
        new PlaceOrderUseCase({
            clientFacade: mockClientFacade,
            productFacade: mockProductFacade,
            catalogFacade: mockCatalogFacade,
            paymentFacade: mockPaymentFacade,
            // @ts-expect-error
            invoiceFacade: mockInvoiceFacade,
            repository: mockCheckoutRepository,
        })

    describe('Validates productMethod', () => {
        mockClientFacade.find.mockResolvedValue(true);
        const placeOrderUsecase = getPlaceOrderUseCase();

        it('should throw error if no products are selected', async () => {
            const input: InputPlaceOrderDTO = {
                clientId: '1',
                products: [],
            };
            
            await expect(placeOrderUsecase['validateProducts'](input)).rejects.toThrow(
                new Error('No products selected')
            );
        });

        it('should throw an error when product is out of stock', async () => {
            mockProductFacade.checkStock.mockImplementation(({productId}: {productId: string}) => (Promise.resolve({
                productId,
                stock: productId === '1' ? 0 : 1,
            })));

            const spyCheckStock = jest.spyOn(mockProductFacade, 'checkStock');

            let input: InputPlaceOrderDTO = {
                clientId: '1',
                products: [{ productId: '1' }],
            };
            
            await expect(placeOrderUsecase['validateProducts'](input)).rejects.toThrow(
                new Error('Product 1 is not available in stock')
            );
            input = {
                clientId: '1',
                products: [{ productId: '0' }, { productId: '1' }],
            };
            
            await expect(placeOrderUsecase['validateProducts'](input)).rejects.toThrow(
                new Error('Product 1 is not available in stock')
            );
            expect(spyCheckStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: '1',
                products: [{ productId: '0' }, { productId: '1' }, { productId: '2' }],
            };
            
            await expect(placeOrderUsecase['validateProducts'](input)).rejects.toThrow(
                new Error('Product 1 is not available in stock')
            );
            expect(spyCheckStock).toHaveBeenCalledTimes(5);
        });
    });

    describe('getProducts method', () => {
        const mockDate = new Date(2000, 1, 1);
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });
        
        it('should return an error when product is not fount', async () => {
            mockCatalogFacade.find.mockResolvedValue(null);
            const placeOrderUsecase = getPlaceOrderUseCase();

            await expect(placeOrderUsecase['getProduct']('0')).rejects.toThrow(
                new Error('Product not found')
            );
        });

        it('should return a product', async () => {
            mockCatalogFacade.find.mockResolvedValue({
                productId: '1',
                name: 'Product Name',
                description: 'Product Description',
                salesPrice: 100,
            } as OutputFindStoreCatalogFacadeDTO)
            
            const placeOrderUsecase = getPlaceOrderUseCase();
            const output = await placeOrderUsecase['getProduct']('1');
            const findSpyOn = jest.spyOn(mockCatalogFacade, 'find');

            expect(findSpyOn).toHaveBeenCalledTimes(1);
            expect(output).toBeDefined();
            expect(output.id.id).toBe('1');
            expect(output.name).toBe('Product Name');
            expect(output.description).toBe('Product Description');
            expect(output.salesPrice).toBe(100);
        });
    });

    describe('execute method', () => {

        it('should throw an error when client not found', async () => {
            mockClientFacade.find.mockResolvedValue(null);

            const placeOrderUsecase = getPlaceOrderUseCase();
            
            const input: InputPlaceOrderDTO = {
                clientId: '0',
                products: [],
            };
            
            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
                new Error('Client Not Found')
            );
        });

        it('should throw error when products are not valid', async () => {
            mockClientFacade.find.mockResolvedValue(true);
            const placeOrderUsecase = getPlaceOrderUseCase();
            const spyValidateProduct = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUsecase, 'validateProducts');

            const input: InputPlaceOrderDTO = {
                clientId: '1',
                products: [],
            };
            
            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
                new Error('No products selected')
            );
            expect(spyValidateProduct).toHaveBeenCalledTimes(1);
        });

        describe('place an order', () => {
            const clientProps = {
                id: '1c',
                name: 'Client 1 Name',
                document: 'Client Document 1',
                email: 'test@mail.com',
                street: 'main st',
                number: '123',
                complement: '',
                city: 'Some City',
                state: 'Some State',
                zipCode: '000123',
            };

            mockClientFacade.find.mockResolvedValue(clientProps);

            mockInvoiceFacade.generate.mockResolvedValue({ id: '1i' });

            const placeOrderUseCase = getPlaceOrderUseCase();

            const products = {
                '1': new Product({
                    id: new Id('1'),
                    name: 'Product 1',
                    description: 'Some description product 1',
                    salesPrice: 40,
                }),
                '2': new Product({
                    id: new Id('2'),
                    name: 'Product 2',
                    description: 'Some description product 2',
                    salesPrice: 30,
                }),
            };

            // @ts-expect-error - spy on private method
            const spyOnValidateProducts = jest.spyOn(placeOrderUseCase, 'validateProducts').mockResolvedValue(null);

            // @ts-expect-error - spy on private method
            const spyOnGetProduct = jest.spyOn(placeOrderUseCase, 'getProduct')
            // @ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => products[productId]);

            it('should not be approved', async () => {
                mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1t',
                    orderId: '1o',
                    amount: 100,
                    status: 'error',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: InputPlaceOrderDTO = {
                    clientId: '1c',
                    products: [{ productId: '1' }, { productId: '2' }],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe(null);
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: '1' }, { productId: '2' }
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c' });
                expect(spyOnValidateProducts).toHaveBeenCalledTimes(1);
                expect(spyOnValidateProducts).toHaveBeenCalledWith(input);
                expect(spyOnGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            });

            it('should be approved', async () => {
                mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1t',
                    orderId: '1o',
                    amount: 100,
                    status: 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: InputPlaceOrderDTO = {
                    clientId: '1c',
                    products: [{ productId: '1' }, { productId: '2' }],
                };

                mockClientFacade.find.mockResolvedValue(clientProps);

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe('1i');
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: '1' }, { productId: '2' }
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c' });
                expect(spyOnValidateProducts).toHaveBeenCalledTimes(1);
                expect(spyOnGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.street,
                    number: clientProps.number,
                    complement: clientProps.complement,
                    city: clientProps.city,
                    state: clientProps.state,
                    zipCode: clientProps.zipCode,
                    items: [
                        {
                            id: products['1'].id.id,
                            name: products['1'].name,
                            price: products['1'].salesPrice,
                        },
                        {
                            id: products['2'].id.id,
                            name: products['2'].name,
                            price: products['2'].salesPrice,
                        }
                    ],
                });
            });
        });
    })
})