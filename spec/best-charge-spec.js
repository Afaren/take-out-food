xdescribe('formatItems', () => {
  it('should get formatted items with count', () => {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let expected = [
      {id: 'ITEM0001', count: 1},
      {id: 'ITEM0013', count: 2},
      {id: 'ITEM0022', count: 1}
    ];
    let formattedItems = formatItems(inputs);

    expect(formattedItems).toEqual(expected);
  })
});

xdescribe('getItemsInfoList', () => {
  it('should get item list with information', () => {
    let formattedItems = [
      {id: 'ITEM0001', count: 1},
      {id: 'ITEM0013', count: 2},
      {id: 'ITEM0022', count: 1}
    ];
    let allItems = loadAllItems();
    let itemInfoList = getCartItemList(allItems, formattedItems);
    let expected = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 1
      }, {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 2
      }, {
        id: 'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count: 1
      }
    ];
    expect(itemInfoList).toEqual(expected);

  })
});

xdescribe('calculateTotalPrice', () => {
  it('should calculate total price of all item', () => {
    let itemInfoList = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 1
      }, {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 2
      }, {
        id: 'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count: 1
      }
    ];
    let totalPrice = calculateTotalPrice(itemInfoList);
    let expected = 38;
    expect(totalPrice).toEqual(expected);

  })
});

describe('calculatePromotion', () => {

  it('should get promotion of items when best is 指定菜品半价', () => {
      let cartItemList = [
        {
          id: 'ITEM0001',
          name: '黄焖鸡',
          price: 18.00,
          count: 1
        }, {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 2
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1
        }
      ];
      let allPromotions = loadPromotions();
      let totalPrice = 38;

      let itemsWithPromotion = calculatePromotion(totalPrice, allPromotions, cartItemList);

      let expected = {
        items: [
          {
            id: 'ITEM0001',
            name: '黄焖鸡',
            price: 18.00,
            count: 1
          }, {
            id: 'ITEM0013',
            name: '肉夹馍',
            price: 6.00,
            count: 2
          }, {
            id: 'ITEM0022',
            name: '凉皮',
            price: 8.00,
            count: 1
          }
        ],
        promotion: {
          type: '指定菜品半价',
          discount: 13,
          items: [
            {
              id: 'ITEM0001',
              name: '黄焖鸡',
              price: 18.00,
              count: 1
            }, {
              id: 'ITEM0022',
              name: '凉皮',
              price: 8.00,
              count: 1
            }
          ]
        }
      }
      expect(itemsWithPromotion).toEqual(expected);

    }
  );

  it('should get promotion of items when best is 满30减6元', () => {
      let itemInfoList = [
        {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 4
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1
        }
      ];
      let allPromotions = loadPromotions();
      let totalPrice = 32;

      let itemsWithPromotion = getPromotionInfo(totalPrice, allPromotions, itemInfoList);

      let expected = {
        items: [
          {
            id: 'ITEM0013',
            name: '肉夹馍',
            price: 6.00,
            count: 4
          }, {
            id: 'ITEM0022',
            name: '凉皮',
            price: 8.00,
            count: 1
          }
        ],
        promotion: {
          type: '满30减6元',
          discount: 6,
        }
      };
      expect(itemsWithPromotion).toEqual(expected);

    }
  );

  it('should get non-promotion of items when there is non-suitable can be used', () => {
      let itemInfoList = [
        {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 4
        }];
      let allPromotions = loadPromotions();
      let totalPrice = 24;

      let itemsWithPromotion = getPromotionInfo(totalPrice, allPromotions, itemInfoList);

      let expected = {
        items: [
          {
            id: 'ITEM0013',
            name: '肉夹馍',
            price: 6.00,
            count: 4
          }],
        promotion: {

        }
      };
      expect(itemsWithPromotion).toEqual(expected);

    }
  )


})

xdescribe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function () {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function () {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});
