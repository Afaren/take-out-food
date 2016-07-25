function formatItems(selectedItems) {
  return selectedItems.map(item => {
    let itemPart = item.split(' x ');
    return {
      id: itemPart[0], count: Number.parseInt(itemPart[1])
    };
  })
}

function getCartItemList(allItems, formattedItems) {
  return formattedItems.map(item => {
    return Object.assign({}, allItems.find(entry => entry.id === item.id), {count: item.count});
  });
}


function calculateTotalPrice(cartItemList) {
  return cartItemList.reduce((acc, cur) => {
    return acc += cur.price * cur.count
  }, 0);

}


function generateSummary(totalPrice, itemsWithPromotion) {

  let header = `============= 订餐明细 =============\n`;

  let body = itemsWithPromotion.items.map(item => {
    return `${item.name} x ${item.count} = ${item.price * item.count}元`;
  }).join('\n');


  let footer;

  if (itemsWithPromotion.promotion.type === '指定菜品半价') {
    footer = `\n-----------------------------------
使用优惠:
指定菜品半价(${itemsWithPromotion.promotion.items.map(item => {
      return item.name
    }).join('，')})，省${itemsWithPromotion.promotion.discount}元
-----------------------------------
总计：${totalPrice - itemsWithPromotion.promotion.discount}元
===================================`
  } else if (itemsWithPromotion.promotion.type === '满30减6元') {
    footer = `\n-----------------------------------
使用优惠:
满30减6元，省${itemsWithPromotion.promotion.discount}元
-----------------------------------
总计：${totalPrice - itemsWithPromotion.promotion.discount}元
===================================`
  } else {
    footer = `\n-----------------------------------
总计：${totalPrice}元
===================================`
  }

  return `${header}${body}${footer}`;

}


function calculatePromotion(totalPrice, allPromotions, cartItemlist) {

  let promotingItems = getPromotingItems(allPromotions, cartItemlist);
  let discount = getDiscount(cartItemlist, promotingItems);
  let promotion = getPromotion(totalPrice, promotingItems, discount);

  return {
    items: cartItemlist,
    promotion: promotion
  };

  function getPromotingItems(allPromotions, cartItemlist) {
    return cartItemlist.reduce((acc, cur) => {
        let found = allPromotions.find(item => item.hasOwnProperty('items')).items.find(id => id === cur.id);
        if (found) {
          let item = cartItemlist.find(entry => entry.id === found);
          acc.push(item);
        }
        return acc;
      }
      , []);
  }


  function getPromotion(totalPrice, promotingItems, discount) {
    let promotion = {};

    if (promotingItems.length < 1) {
      if (totalPrice < 30) {
        // empty non-promotion
      }
      else {
        promotion.type = '满30减6元';
        promotion.discount = 6;
      }
    }
    else {
      if (totalPrice > 30 && discount <= 6) {
        promotion.type = '满30减6元';
        promotion.discount = 6;
      }
      else {
        promotion.type = '指定菜品半价';
        promotion.items = promotingItems;
        promotion.discount = discount;
      }
    }

    return promotion;

  }

  function getDiscount(cartItemList, promotingItems) {
    return promotingItems.length > 1 ? 0 :
      promotingItems.reduce((acc, cur) => {
        let found = cartItemList.find(item => item.id === cur.id);
        return acc += found.count * found.price / 2;
      }, 0)
  }





}


function bestCharge(selectedItems) {
  let formattedItems = formatItems(selectedItems);
  let allItems = loadAllItems();
  let itemInfoList = getCartItemList(allItems, formattedItems);
  let totalPrice = calculateTotalPrice(itemInfoList);
  let allPromotions = loadPromotions();
  let itemsWithPromotion = calculatePromotion(totalPrice, allPromotions, itemInfoList);
  let summary = generateSummary(totalPrice, itemsWithPromotion);
  return summary;
}
