/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import ProductCommentUpdateComponent from '@/entities/product-comment/product-comment-update.vue';
import ProductCommentClass from '@/entities/product-comment/product-comment-update.component';
import ProductCommentService from '@/entities/product-comment/product-comment.service';

import ProductService from '@/entities/product/product.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.use(ToastPlugin);
localVue.component('font-awesome-icon', {});
localVue.component('b-input-group', {});
localVue.component('b-input-group-prepend', {});
localVue.component('b-form-datepicker', {});
localVue.component('b-form-input', {});

describe('Component Tests', () => {
  describe('ProductComment Management Update Component', () => {
    let wrapper: Wrapper<ProductCommentClass>;
    let comp: ProductCommentClass;
    let productCommentServiceStub: SinonStubbedInstance<ProductCommentService>;

    beforeEach(() => {
      productCommentServiceStub = sinon.createStubInstance<ProductCommentService>(ProductCommentService);

      wrapper = shallowMount<ProductCommentClass>(ProductCommentUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          productCommentService: () => productCommentServiceStub,
          alertService: () => new AlertService(),

          productService: () =>
            sinon.createStubInstance<ProductService>(ProductService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.productComment = entity;
        productCommentServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(productCommentServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.productComment = entity;
        productCommentServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(productCommentServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundProductComment = { id: 123 };
        productCommentServiceStub.find.resolves(foundProductComment);
        productCommentServiceStub.retrieve.resolves([foundProductComment]);

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
