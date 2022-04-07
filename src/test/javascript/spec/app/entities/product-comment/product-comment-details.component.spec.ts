/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import ProductCommentDetailComponent from '@/entities/product-comment/product-comment-details.vue';
import ProductCommentClass from '@/entities/product-comment/product-comment-details.component';
import ProductCommentService from '@/entities/product-comment/product-comment.service';
import router from '@/router';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('ProductComment Management Detail Component', () => {
    let wrapper: Wrapper<ProductCommentClass>;
    let comp: ProductCommentClass;
    let productCommentServiceStub: SinonStubbedInstance<ProductCommentService>;

    beforeEach(() => {
      productCommentServiceStub = sinon.createStubInstance<ProductCommentService>(ProductCommentService);

      wrapper = shallowMount<ProductCommentClass>(ProductCommentDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { productCommentService: () => productCommentServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundProductComment = { id: 123 };
        productCommentServiceStub.find.resolves(foundProductComment);

        // WHEN
        comp.retrieveProductComment(123);
        await comp.$nextTick();

        // THEN
        expect(comp.productComment).toBe(foundProductComment);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundProductComment = { id: 123 };
        productCommentServiceStub.find.resolves(foundProductComment);

        // WHEN
        comp.beforeRouteEnter({ params: { productCommentId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.productComment).toBe(foundProductComment);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});
