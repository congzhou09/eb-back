import Mock from 'mockjs';
import adminAPI from './api/adminController';
import totalAPI from './api/totalController';
import userAPI from './api/userController';
import categrayAPI from './api/categoryController';
import productAPI from './api/productController';
import orderAPI from './api/orderController';
import accountAPI from './api/accountController';
import activityAPI from './api/activityController';
import couponAPI from './api/couponController';
import coinAPI from './api/coinController';
import promotionAPI from './api/promotionController';
import agentAPI from './api/agentController';

// 登录&首页
Mock.mock(/\/admin\/login/, 'post', adminAPI.login);
Mock.mock(/\/admin\/getrid/, 'post', adminAPI.getrid);
Mock.mock(/\/admin\/logout/, 'post', adminAPI.logout);
Mock.mock(/\/admin\/list/, 'post', adminAPI.list);
Mock.mock(/\/admin\/add/, 'post', adminAPI.add);
Mock.mock(/\/total\/back/, 'post', totalAPI.back);

// user
Mock.mock(/\/user\/list/, 'post', userAPI.list);
Mock.mock(/\/user\/viewuserinfo/, 'post', userAPI.viewuserinfo);
Mock.mock(/\/user\/changeuserinfo/, 'post', userAPI.changeuserinfo);
Mock.mock(/\/user\/changeuserstate/, 'post', userAPI.changeuserstate);

// product
Mock.mock(/\/categray\/list/, 'post', categrayAPI.list);
Mock.mock(/\/categray\/changesort/, 'post', categrayAPI.changesort);
Mock.mock(/\/categray\/delete/, 'post', categrayAPI.delete);
Mock.mock(/\/categray\/update/, 'post', categrayAPI.update);
Mock.mock(/\/categray\/add/, 'post', categrayAPI.update);
Mock.mock(/\/product\/unlogin\/list/, 'post', productAPI.list);
Mock.mock(/\/product\/get_valid_product_coupon/, 'get', productAPI.get_valid_product_coupon);
Mock.mock(/\/product\/unlogin\/productinfo/, 'post', productAPI.productinfo);
Mock.mock(/\/product\/update/, 'post', productAPI.update);
Mock.mock(/\/product\/changestate/, 'post', productAPI.changestate);
Mock.mock(/\/product\/add/, 'post', productAPI.add);
Mock.mock(/\/file\/upload/, 'post', totalAPI.fileupload);

// order
Mock.mock(/\/order\/query/, 'post', orderAPI.query);
Mock.mock(/\/order\/express/, 'post', orderAPI.express);
Mock.mock(/\/order\/close/, 'post', orderAPI.close);
Mock.mock(/\/order\/serviceremark/, 'post', orderAPI.updateOk);

// account
Mock.mock(/\/account\/list/, 'post', accountAPI.list);
Mock.mock(/\/account\/changeuseraccount/, 'post', accountAPI.changeuseraccount);
Mock.mock(/\/account\/applylist/, 'post', accountAPI.applylist);
Mock.mock(/\/account\/info/, 'post', accountAPI.info);

// banner
Mock.mock(/\/banner\/list/, 'post', activityAPI.bannerlist);
Mock.mock(/\/banner\/changesort/, 'post', activityAPI.bannerchangeok);
Mock.mock(/\/banner\/update/, 'post', activityAPI.bannerchangeok);
Mock.mock(/\/banner\/delete/, 'post', activityAPI.bannerchangeok);
Mock.mock(/\/channel\/list/, 'post', activityAPI.channellist);
Mock.mock(/\/channel\/productlist/, 'post', activityAPI.productlist);
Mock.mock(/\/channel\/update/, 'post', activityAPI.bannerchangeok);
Mock.mock(/\/channel\/delete/, 'post', activityAPI.bannerchangeok);
Mock.mock(/\/channel\/sort/, 'post', activityAPI.bannerchangeok);
Mock.mock(/\/channel\/add/, 'post', activityAPI.bannerchangeok);

// coupon
Mock.mock(/\/coupon\/admin\/couponlist/, 'get', couponAPI.list);
Mock.mock(/\/coupon\/admin\/coupon\?/, 'get', couponAPI.coupon);
Mock.mock(/\/coupon\/admin\/coupon_send_record/, 'get', couponAPI.coupon_send_record);
Mock.mock(/\/coupon\/admin\/updatecoupon/, 'post', couponAPI.updateok);
Mock.mock(/\/coupon\/admin\/ivalidcoupon/, 'post', couponAPI.updateok);
Mock.mock(/\/coupon\/admin\/sendcoupon/, 'post', couponAPI.updateok);
Mock.mock(/\/coupon\/admin\/createcoupon/, 'post', couponAPI.updateok);

// coin
Mock.mock(/\/gold_category\/admin\/get_category_list/, 'get', coinAPI.get_category_list);
Mock.mock(/\/gold_category\/admin\/update_category/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_category\/admin\/create_category/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_category\/admin\/remove_category/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_category\/admin\/switch_sort/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_product\/admin\/get_product_list/, 'get', coinAPI.get_product_list);
Mock.mock(/\/gold_product\/admin\/get_product/, 'get', coinAPI.get_product);
Mock.mock(/\/gold_product\/admin\/edit_product/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_product\/admin\/update_product_state/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_product\/admin\/create_product/, 'post', coinAPI.updateok);
Mock.mock(/\/recharge_card\/admin\/get_card_list/, 'get', coinAPI.get_card_list);
Mock.mock(/\/recharge_card\/admin\/create_recharge_card/, 'post', coinAPI.updateok);
Mock.mock(/\/recharge_card\/admin\/update_recharge_card/, 'post', coinAPI.updateok);
Mock.mock(/\/recharge_card\/admin\/delete_recharge_card/, 'post', coinAPI.updateok);
Mock.mock(/\/recharge_card\/admin\/get_recharge_card/, 'get', coinAPI.get_recharge_card);
Mock.mock(/\/recharge_card\/admin\/get_card_product/, 'get', coinAPI.get_card_product);
Mock.mock(/\/gold_channel\/admin\/get_channel_list/, 'get', coinAPI.get_channel_list);
Mock.mock(/\/gold_channel\/admin\/get_channel_products/, 'get', coinAPI.get_channel_products);
Mock.mock(/\/gold_channel\/admin\/update_channel/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_channel\/admin\/remove_channel/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_channel\/admin\/create_channel/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_order\/admin\/get_order_list/, 'get', coinAPI.get_order_list);
Mock.mock(/\/gold_order\/admin\/cancel_order/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_order\/admin\/get_order_detail/, 'get', coinAPI.get_order_detail);
Mock.mock(/\/gold_order\/admin\/update_express/, 'post', coinAPI.updateok);
Mock.mock(/\/gold_log\/admin\/get_exchange_record/, 'get', coinAPI.get_exchange_record);

// promotion
Mock.mock(/\/game\/list/, 'post', promotionAPI.gamelist);
Mock.mock(/\/game\/plist/, 'post', promotionAPI.gameplist);
Mock.mock(/\/game\/uplist/, 'post', promotionAPI.gameuplist);
Mock.mock(/\/game\/get/, 'post', promotionAPI.gameget);
Mock.mock(/\/game\/updatepromotion/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/delete/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/addpromotion/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/changesort/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/add/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/updategame/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/get_user_group/, 'get', promotionAPI.get_user_group);
Mock.mock(/\/game\/update_group_effect/, 'get', promotionAPI.updateok);
Mock.mock(/\/game\/changusergroupesort/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/queryusergroup/, 'post', promotionAPI.queryusergroup);
Mock.mock(/\/game\/updateusergroup/, 'post', promotionAPI.updateok);
Mock.mock(/\/game\/result/, 'post', promotionAPI.gameresult);
Mock.mock(/\/game\/formulalist/, 'post', promotionAPI.formulalist);
Mock.mock(/\/game\/formula/, 'post', promotionAPI.formula);
Mock.mock(/\/game\/update_formula/, 'post', promotionAPI.update_formula);
Mock.mock(/\/game\/jackpotlist/, 'post', promotionAPI.jackpotlist);
Mock.mock(/\/game\/update_jackpot/, 'post', promotionAPI.updateok);

// agent
Mock.mock(/\/proxy\/admin\/get_proxy_list/, 'get', agentAPI.get_proxy_list);
Mock.mock(/\/proxy\/admin\/create_new_proxy/, 'post', agentAPI.updateok);
Mock.mock(/\/proxy\/admin\/cancel_proxy/, 'post', agentAPI.updateok);
Mock.mock(/\/proxy\/admin\/get_proxy_detail/, 'get', agentAPI.get_proxy_detail);
Mock.mock(/\/proxy\/admin\/edit_proxy/, 'post', agentAPI.updateok);
Mock.mock(/\/proxy\/admin\/get_profit_detail/, 'get', agentAPI.get_profit_detail);
Mock.mock(/\/proxy\/admin\/get_bind_user/, 'get', agentAPI.get_bind_user);
Mock.mock(/\/proxy\/admin\/get_lower_proxy/, 'get', agentAPI.get_lower_proxy);
Mock.mock(/\/proxy\/admin\/get_lower_lower_proxy/, 'get', agentAPI.get_lower_proxy);
Mock.mock(/\/proxy\/admin\/select_proxy_note/, 'get', agentAPI.select_proxy_note);
Mock.mock(/\/proxy\/admin\/update_layer_percent/, 'post', agentAPI.updateok);
Mock.mock(/\/proxy\/admin\/get_withdraw_record/, 'get', agentAPI.get_withdraw_record);
Mock.mock(/\/proxy\/admin\/get_withdraw_detail/, 'get', agentAPI.get_withdraw_detail);

export default Mock;
